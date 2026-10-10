import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Preview image shown when the website link is shared on WhatsApp, Facebook, LinkedIn etc.
export const alt = `${SITE.name} — Home Loan & Loan Against Property`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function logoDataUrl() {
  if (!SITE.logoImage || /^https?:/.test(SITE.logoImage)) return "";
  try {
    const file = fs.readFileSync(path.join(process.cwd(), "public", SITE.logoImage));
    return `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    return "";
  }
}

export default function OgImage() {
  const logo = logoDataUrl();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "linear-gradient(120deg, #052f5f 0%, #1b1dc7 60%, #0066ff 100%)", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {logo ? (
            <img src={logo} width={120} height={120} alt="" />
          ) : (
            <div style={{ width: 96, height: 96, borderRadius: 24, background: "white", color: "#0066ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 700 }}>₹</div>
          )}
          <div style={{ fontSize: 64, fontWeight: 700 }}>{SITE.name}</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 52, fontWeight: 700, lineHeight: 1.2 }}>Home Loan &amp; Loan Against Property</div>
        <div style={{ marginTop: 16, fontSize: 32, color: "#cfe0ff" }}>Lowest rates from 30+ Banks &amp; NBFCs · Personal &amp; Business Loans · Free CIBIL Check</div>
        <div style={{ marginTop: 48, display: "flex", gap: 16 }}>
          {["Lowest rates", "Quick approval", "Free expert help"].map((t) => (
            <div key={t} style={{ padding: "12px 24px", borderRadius: 999, background: "#ffc542", color: "#1c1d1f", fontSize: 26, fontWeight: 700 }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
