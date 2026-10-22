/**
 * Copies every collection (documents + indexes) from one MongoDB database to another.
 * Safe to run again: documents are upserted by _id, so re-running only adds/updates what changed.
 *
 *   FROM_URI="mongodb+srv://…/myloanwala" TO_URI="mongodb+srv://…/myloanwala" npx tsx scripts/copy-db.mts
 *
 * Database name comes from the URI path (defaults to "myloanwala").
 */
import { MongoClient, type AnyBulkWriteOperation, type Document } from "mongodb";

const FROM = process.env.FROM_URI;
const TO = process.env.TO_URI;
if (!FROM || !TO) throw new Error("Set FROM_URI and TO_URI");

const dbName = (uri: string) => new URL(uri.replace(/^mongodb\+srv:/, "http:").replace(/^mongodb:/, "http:")).pathname.replace(/^\//, "") || "myloanwala";
const hostOf = (uri: string) => new URL(uri.replace(/^mongodb\+srv:/, "http:").replace(/^mongodb:/, "http:")).host;

const src = new MongoClient(FROM);
const dst = new MongoClient(TO);
await Promise.all([src.connect(), dst.connect()]);
const from = src.db(dbName(FROM));
const to = dst.db(dbName(TO));
console.log(`Copying ${hostOf(FROM)}/${from.databaseName}  →  ${hostOf(TO)}/${to.databaseName}\n`);

let ok = true;
for (const { name, type } of await from.listCollections().toArray()) {
  if (type !== "collection" || name.startsWith("system.")) continue;
  const s = from.collection(name);
  const d = to.collection(name);

  // documents (upsert by _id, in batches)
  let batch: AnyBulkWriteOperation<Document>[] = [];
  let copied = 0;
  for await (const doc of s.find()) {
    batch.push({ replaceOne: { filter: { _id: doc._id }, replacement: doc, upsert: true } });
    if (batch.length === 500) { await d.bulkWrite(batch, { ordered: false }); copied += batch.length; batch = []; }
  }
  if (batch.length) { await d.bulkWrite(batch, { ordered: false }); copied += batch.length; }

  // indexes (unique email/slug etc.)
  const indexes = (await s.listIndexes().toArray()).filter((i) => i.name !== "_id_");
  for (const { key, name: idxName, v: _v, ns: _ns, ...opts } of indexes) {
    void _v; void _ns;
    await d.createIndex(key, { name: idxName, ...opts }).catch((e) => console.log(`   index ${idxName}: ${e.message}`));
  }

  const [a, b] = await Promise.all([s.countDocuments(), d.countDocuments()]);
  const match = a === b;
  if (!match) ok = false;
  console.log(`${match ? "✔" : "✘"} ${name.padEnd(12)} source ${String(a).padStart(4)} → target ${String(b).padStart(4)}  (copied ${copied}, indexes ${indexes.length})`);
}

await Promise.all([src.close(), dst.close()]);
console.log(ok ? "\nAll collections copied and verified." : "\nSome counts differ — check above.");
