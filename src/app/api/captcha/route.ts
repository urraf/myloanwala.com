import { createCaptcha } from "@/lib/captcha";

export async function GET() {
  return Response.json(createCaptcha(), { headers: { "Cache-Control": "no-store" } });
}
