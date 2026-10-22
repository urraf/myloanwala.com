import { headers } from "next/headers";
import { brandForHost, type Brand } from "./site";

/** The brand for the current request, chosen by the domain the visitor opened (server only). */
export async function getBrand(): Promise<Brand> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const brand = brandForHost(host);
  if (!host) return brand;
  const proto = h.get("x-forwarded-proto") || (/^(localhost|127\.|[^.]+\.localhost)/.test(host) ? "http" : "https");
  return { ...brand, url: `${proto}://${host.split(",")[0].trim()}` }; // absolute links always match the visited domain
}
