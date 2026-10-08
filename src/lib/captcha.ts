import crypto from "node:crypto";

// Simple image captcha: random code drawn as a distorted SVG, verified with a signed token (no DB needed).
const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const TTL_MS = 5 * 60_000;

const sign = (text: string, exp: number) =>
  crypto.createHmac("sha256", process.env.AUTH_SECRET || "captcha").update(`${text}.${exp}`).digest("hex");

export function createCaptcha() {
  const text = Array.from({ length: 5 }, () => CHARS[crypto.randomInt(CHARS.length)]).join("");
  const exp = Date.now() + TTL_MS;
  const r = (min: number, max: number) => min + Math.random() * (max - min);
  const colors = ["#1b3a8c", "#0066ff", "#d6246e", "#11724f", "#7b1fa2"];

  const noise = Array.from({ length: 6 }, () =>
    `<line x1="${r(0, 150)}" y1="${r(0, 46)}" x2="${r(0, 150)}" y2="${r(0, 46)}" stroke="${colors[crypto.randomInt(5)]}" stroke-opacity=".35" stroke-width="${r(1, 2)}"/>`
  ).join("");
  const dots = Array.from({ length: 30 }, () =>
    `<circle cx="${r(0, 150)}" cy="${r(0, 46)}" r="${r(0.5, 1.5)}" fill="#8a8d93" fill-opacity=".5"/>`
  ).join("");
  const letters = [...text]
    .map((c, i) => {
      const x = 16 + i * 27 + r(-3, 3);
      const y = 32 + r(-4, 4);
      return `<text x="${x}" y="${y}" transform="rotate(${r(-22, 22)} ${x} ${y})" font-family="Verdana, sans-serif" font-size="${r(22, 27)}" font-weight="700" fill="${colors[crypto.randomInt(5)]}">${c}</text>`;
    })
    .sort(() => Math.random() - 0.5) // shuffle source order so the code can't be read straight from the markup
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="46" viewBox="0 0 150 46"><rect width="150" height="46" fill="#f2f7ff"/>${noise}${dots}${letters}</svg>`;
  return { svg, token: `${exp}.${sign(text, exp)}` };
}

// Solved captchas can be used only once (kept until they expire)
const used = new Map<string, number>();

export function verifyCaptcha(token: string, answer: string) {
  const [expStr, sig] = (token || "").split(".");
  const exp = Number(expStr);
  if (!exp || !sig || Date.now() > exp || used.has(sig)) return false;
  used.set(sig, exp); // a token is consumed by any attempt, right or wrong
  if (used.size > 2000) for (const [k, e] of used) if (e < Date.now()) used.delete(k);
  const expected = sign(answer.trim().toUpperCase(), exp);
  return expected.length === sig.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
}
