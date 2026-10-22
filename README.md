# Lobuy

Next.js monorepo (replaces the old Vite `frontend/` + Express `backend/`).

| Folder | App | Local | Production tip |
|--------|-----|-------|----------------|
| `lobuy/` | Customer storefront + API | http://localhost:3000 | Vercel project → **Root Directory = `lobuy`** → domain lobuy.in |
| `lobuy-admin/` | Admin dashboard + API | http://localhost:3001 | Second Vercel project → **Root Directory = `lobuy-admin`** |

Both apps talk to the **same MongoDB**. Secrets live in each app’s `.env` (never committed).

## Run locally

```bash
# storefront
cd lobuy && npm install && npm run dev

# admin (other terminal)
cd lobuy-admin && npm install && npm run dev
```

Or from repo root: `npm run dev` / `npm run dev:admin`.

## Env (each app)

Copy your secrets into `lobuy/.env` and `lobuy-admin/.env`:

- `MONGO_URI`
- `JWT_TOKEN` (32+ random chars)
- `APP_URL` / `ALLOWED_ORIGINS` (your production URL)
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- `RESEND_API_KEY`, `EMAIL_FROM`
- Cloudinary: `CLOUD_NAME`, `CLOUD_KEY`, `CLOUD_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY`

Also set the same keys in **Vercel → Project → Settings → Environment Variables**.

## Deploy on Vercel (lobuy.in)

1. Push this repo to GitHub.
2. In Vercel, open the project linked to lobuy.in (or import `suhair20/phonefix`).
3. Set **Root Directory** to `lobuy` (not `frontend`).
4. Framework: Next.js. Build: `npm run build`. Output: default.
5. Add env vars, redeploy.
6. (Optional) Create a second Vercel project for admin with root `lobuy-admin`.
