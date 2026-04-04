# 🚀 LocIntel Launch Checklist

> **Legend:**
> - [ ] Not started
> - [/] In progress
> - [x] ✅ Done
> - [!] Blocked — needs action

> **Who does what:**
> - 🙋 **YOU** — needs your manual action (login, copy-paste, click)
> - 🤖 **ME** — I do this automatically when you say go

---

## ✅ Phase 1 — Local Setup (DONE)

- [x] 🤖 `.env` file filled with Supabase URL, anon key, DB URL, Mapbox token
- [x] 🤖 `NEXTAUTH_SECRET` generated (secure 64-char key)
- [x] 🤖 Dev server running at `http://localhost:3000`
- [x] 🤖 Map loads, Supabase connects, UI renders correctly

---

## ✅ Phase 2 — GitHub Push (DONE)

- [x] 🤖 Added `data/`, `backend/`, `catboost_info/`, `artifacts/`, `.agent/` to `.gitignore`
- [x] 🤖 `.env` and `.env.local` confirmed excluded from git (credentials safe)
- [x] 🤖 All code changes committed and pushed to `AyushKumar-lab/p12026` → `main`

---

## 🔐 Phase 3 — Secret Keys (YOU must do this)

> These require you to log into external services and copy keys.

- [x] 🙋 **Get Supabase Service Role Key** ✅
  - Key added to `.env` automatically by 🤖

- [ ] 🙋 **Get Cloudinary Credentials** *(only if you need image uploads)*
  1. Go to → https://cloudinary.com → login
  2. On Dashboard, copy: **Cloud Name**, **API Key**, **API Secret**
  3. Tell me the values
  4. 🤖 I will add them to your `.env` file

---

## 🌐 Phase 4 — Vercel Deployment (HALF YOU, HALF ME)

- [ ] 🙋 **Add env vars to Vercel**
  1. Go to → https://vercel.com/dashboard
  2. Click your `p12026` project → **Settings → Environment Variables**
  3. Add ALL of these (copy from your `.env` file):
     ```
     DATABASE_URL
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     NEXTAUTH_URL  ← set to your Vercel URL e.g. https://p12026.vercel.app
     NEXTAUTH_SECRET
     NEXT_PUBLIC_MAPBOX_API_KEY
     NEXT_PUBLIC_MAPBOX_TOKEN
     ```
  4. Click **Save** for each variable
  5. Tell me: *"Vercel env vars added"*

- [ ] 🤖 I will verify your Vercel deployment is live and check for errors

---

## 🗄️ Phase 5 — Database Setup (YOU + ME)

> Your Supabase DB is connected but may have no data yet.

- [ ] 🙋 **Check if database has any data**
  1. Go to → https://supabase.com/dashboard → your project
  2. Click **Table Editor**
  3. Check if `properties` and `users` tables exist and have rows
  4. Tell me what you see

- [ ] 🤖 If tables are empty → I will run the seed SQL for you
- [ ] 🤖 If schema is missing → I will run `supabase/setup.sql` for you

---

## 🧪 Phase 6 — Final Testing (ME)

> Once all above is done, I will do this automatically.

- [ ] 🤖 Open live Vercel URL and verify homepage loads
- [ ] 🤖 Check Properties page shows correct data
- [ ] 🤖 Check Map renders on Locations page
- [ ] 🤖 Check Analyze page works
- [ ] 🤖 Confirm no console errors in browser

---

## 📋 Progress Log

| Date | Who | What |
|------|-----|------|
| 2026-03-23 | 🤖 ME | `.env` filled, dev server started at localhost:3000 |
| 2026-03-23 | 🤖 ME | GitHub push completed — code live on main branch |

---

## ⚡ Quick Reference — What to Tell Me

| When you're ready to... | Say this |
|---|---|
| Add service role key | `"My service role key is: ey..."` |
| Add Cloudinary | `"My cloudinary details are: name=..., key=..., secret=..."` |
| After adding Vercel env vars | `"Vercel env vars added, please check deployment"` |
| Seed the database | `"Please seed the database"` |
| Final check | `"Everything is done, do final checks"` |
