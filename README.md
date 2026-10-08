# MyLoanWala

Loan comparison website (Paisabazaar-style) with an admin panel, an NBFC/DSA partner dashboard and AI blog automation.

**Stack:** Next.js 16 (frontend + backend in one app) · MongoDB (Mongoose) · Tailwind CSS · Groq AI · Pexels images

## What's inside

| Area | URL | What it does |
|---|---|---|
| Website | `/`, `/personal-loan`, `/business-loan`, `/home-loan`, `/loan-against-property`, `/gold-loan`, `/car-loan` | Homepage + loan pages with apply form, rates table, EMI calculator, eligibility, FAQs |
| | `/apply`, `/offers`, `/emi-calculator`, `/blog`, `/about`, `/contact` | Apply form, offers, calculator, blog |
| Partner portal | `/partner` → `/partner/dashboard` | NBFC/DSA register & login, see assigned leads, update status, submit new leads |
| Admin (secret) | `/admin` | Login with captcha, forgot password via email OTP, leads (assign to partners, CSV export), partners (approve/block), blogs, offers, AI automation, account |

Every form on the website saves a **lead** in MongoDB. The admin assigns leads to partners, and partners update the status.

## Rebrand for a client (no code changes)

Everything brand-related comes from `.env` (see the **BRAND** and **CONTACT** sections in `.env.example`):
`NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_DOMAIN`, logo text/tagline **or** `NEXT_PUBLIC_LOGO_IMAGE` (put the file in `/public`),
`NEXT_PUBLIC_BOT_NAME`, phone, WhatsApp, email, address, hours. Run `npm run build` after changing them.
The starter blog articles, AI prompts, chatbot, emails, social preview image and footer all use these values.
Brand colours live in `src/app/globals.css` (`--color-brand`, `--color-navy`, …).

## Lead alerts

Every new lead (website form, AI chat, partner) and every new partner registration is emailed to
`LEAD_NOTIFY_EMAIL` (or `ADMIN_EMAIL`) once SMTP is configured.

## Fill a new database (`npm run seed`)

`npm run seed` adds everything a fresh database needs so the site looks complete: the admin account
(from `ADMIN_EMAIL` / `ADMIN_PASSWORD`), settings, 18 lender offers, 8 starter articles, and **demo** leads & partners
(demo partner login password: `Partner@123`). `npm run seed -- --ai` also writes 6 extra articles with AI.
It is safe to run again — it only adds what's missing. Remove the demo leads/partners any time from
**Admin → Dashboard → Remove demo data**.

## Run locally

```bash
npm install
cp .env.example .env      # then fill in the values
npm run dev               # http://localhost:3000
```

The first admin account is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` the first time someone opens `/admin`.

## Blogs

**Admin → Blogs → New Post** — write posts yourself or with AI:
- **Write with AI:** type a topic → AI writes the full article and fills title, slug, keywords, SEO title, meta description, category, image alt and finds a cover photo (Pexels). Review, then Save.
- **Write manually:** title, content (Markdown with live preview), summary, category, cover image (upload / URL / auto-find), image alt text.
- **SEO panel:** live Google search preview, slug, SEO title & meta description with length counters, keywords, an SEO score checklist and **Auto-fill SEO with AI** for hand-written posts.
- 8 starter articles (with CC0 photos in `public/blog/`) are added automatically the first time the blog is empty. Edit or delete them freely.

## AI chat assistant ("Loan Mitra")

Floating robot button on every public page. Uses Groq (`GROQ_API_KEY`; optional `GROQ_CHAT_MODEL`, defaults to `GROQ_MODEL`).
- Answers **only** loan / credit / EMI / personal-finance / MyLoanWala questions; politely refuses anything else.
- Agent tools: calculates EMI exactly, shows live offers from Admin → Offers, and can **submit a loan application** (after the visitor confirms) — it appears in Admin → Leads with the note "Submitted via AI chat assistant".
- Knowledge comes from `src/lib/products.ts` + `src/lib/site.ts`; behaviour rules are in `src/lib/chatbot.ts`.
- Rate limited to 25 messages / 10 minutes per visitor to protect your Groq quota. Without a Groq key it shows your phone number instead.

## AI blog automation (no cron job needed)

The scheduler runs **inside the app** (`src/instrumentation.ts` → `src/lib/scheduler.ts`). It checks every 5 minutes and publishes a new post when the interval set in **Admin → AI Automation** has passed (default: every 1 hour).

- Needs `GROQ_API_KEY` (writes the post — the best available Groq model is chosen automatically, with fallback if one is rate-limited) and `PEXELS_API_KEY` (finds a matching photo; free at pexels.com/api).
- Turn it on/off, change the interval and topics from **Admin → AI Automation**. There's also a **Generate with AI** button for one-off posts.
- Keep PM2 at **1 instance**. Running more instances is safe (each run is locked in the database), but it isn't needed.

## Deploy on Hostinger VPS (Ubuntu)

```bash
# 1. Install Node 20+ and PM2 (one time)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm i -g pm2

# 2. Upload the project (git clone or upload the folder), then:
cd myloanwala
npm ci
nano .env.production # paste your production settings (see .env.example)
npm run seed         # only for a brand-new database
npm run build
pm2 start ecosystem.config.js
pm2 save && pm2 startup   # auto-start after reboot
```

**3. Nginx** (`/etc/nginx/sites-available/myloanwala`):

```nginx
server {
    server_name myloanwala.com www.myloanwala.com;
    client_max_body_size 10M;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/myloanwala /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d myloanwala.com -d www.myloanwala.com
```

**Updating later:** `git pull && npm ci && npm run build && pm2 restart myloanwala`

**Logs:** `pm2 logs myloanwala`. If SMTP isn't set up yet, the admin password-reset OTP is printed here.

### Admin forgot password
On `/admin` click **Forgot Password? Reset with OTP** (also in Admin → Account). Enter the admin email + captcha → a 6-digit OTP is emailed (valid 10 min, 5 attempts) → enter OTP + new password.
`DUMMY_OTP` in `.env` makes a fixed OTP work for testing — **keep it empty on the live server**.

> Uploaded blog images are saved in the `uploads/` folder. Keep this folder when you redeploy, and include it in backups.

## Where to edit content

- Business name, phone, email, address: `.env` (`NEXT_PUBLIC_*`) and `src/lib/site.ts`
- Loan product text, rates, eligibility, FAQs: `src/lib/products.ts`
- Homepage stats & testimonials: top of `src/app/(site)/page.tsx`
- Brand colours: `src/app/globals.css` (`@theme`)
- Lender offers: **Admin → Offers** (no code needed). Bank logos appear automatically when the lender name matches one in `src/lib/banks.ts`
- Partner bank logos grid: `src/lib/banks.ts` + images in `public/banks/` — remove any lender the business doesn't actually work with
