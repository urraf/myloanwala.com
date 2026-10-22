import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getBrand } from "./brand";

/** Square brand icon (favicon / apple icon): the logo badge if the brand has one, else a ₹ badge. */
export async function brandIcon(px: number) {
  const brand = await getBrand();
  let logo = "";
  if (brand.logoImage && !/^https?:/.test(brand.logoImage)) {
    try {
      logo = `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public", brand.logoImage)).toString("base64")}`;
    } catch {}
  }
  return new ImageResponse(
    logo ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo} width={px} height={px} alt="" />
    ) : (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: px * 0.22, background: "linear-gradient(135deg, #0066ff, #1b1dc7)", color: "white", fontSize: px * 0.62, fontWeight: 700 }}>
        ₹
      </div>
    ),
    { width: px, height: px }
  );
}
