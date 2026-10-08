import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { Admin, Partner } from "./models";

type Role = "admin" | "partner";
const COOKIE: Record<Role, string> = { admin: "mlw_admin", partner: "mlw_partner" };
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET must be set (min 16 chars) in .env");
  return new TextEncoder().encode(s);
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 10);
export const checkPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

export async function createSession(role: Role, id: string) {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE[role], token, {
    httpOnly: true,
    sameSite: "lax",
    // Secure cookies only work on https — on a plain http IP they'd be dropped
    secure: (process.env.SITE_URL || "").startsWith("https://"),
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(role: Role) {
  (await cookies()).delete(COOKIE[role]);
}

async function readSession(role: Role) {
  const token = (await cookies()).get(COOKIE[role])?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === role && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}

/** Returns the logged-in admin or null. */
export async function getAdmin() {
  const id = await readSession("admin");
  if (!id) return null;
  await connectDB();
  return Admin.findById(id).lean();
}

/** Returns the logged-in, approved partner or null. */
export async function getPartner() {
  const id = await readSession("partner");
  if (!id) return null;
  await connectDB();
  const p = await Partner.findById(id).lean();
  return p && p.status === "approved" ? p : null;
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin");
  return admin;
}

export async function requirePartner() {
  const partner = await getPartner();
  if (!partner) redirect("/partner");
  return partner;
}

/** First run: create the admin account from ADMIN_EMAIL / ADMIN_PASSWORD in .env */
export async function ensureAdminSeeded() {
  await connectDB();
  if (await Admin.exists({})) return;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  await Admin.create({ email, passwordHash: await hashPassword(password) });
}
