import "server-only";
import nodemailer from "nodemailer";

/**
 * Sends an email using SMTP settings from .env (Hostinger email works fine:
 * SMTP_HOST=smtp.hostinger.com, SMTP_PORT=465).
 * If SMTP is not configured, the email is printed to the server log instead.
 */
export async function sendMail(to: string, subject: string, html: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log(`[mail] SMTP not configured — skipped email to ${to}: ${subject}`);
    return;
  }
  const port = Number(SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  await transporter.sendMail({ from: SMTP_FROM || SMTP_USER, to, subject, html });
}
