# Deployment Guide — Elite Portfolio Website

## Prerequisites

- Node.js 18+ installed
- Python 3.9+ installed
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account
- A [Netlify](https://netlify.com) account

---

## Step 1: Supabase Setup

1. **Create a new project** at [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Run the SQL schema**: Go to **SQL Editor** → paste the contents of `supabase-schema.sql` → click **Run**
3. **Create Storage bucket**: Go to **Storage** → **New Bucket** → name it `project-images` → set to **Public bucket**
4. **Create admin user**: Go to **Authentication** → **Users** → **Add User** → enter your email/password
5. **Copy your keys** from **Settings** → **API**:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Anon (public) key**
   - **Service role key** (keep this secret!)

---

## Step 2: Frontend (Netlify)

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=https://your-backend.vercel.app
```

### Local development:
```bash
npm install
npm run dev
```

### Deploy to Netlify:
1. Push `frontend/` to GitHub
2. In Netlify → **Add new site** → **Import from Git**
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify settings

---

## Step 3: Backend (Vercel)

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

### Local development:
```bash
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8000
```

### Deploy to Vercel:
1. Push `backend/` to GitHub (separate repo or monorepo)
2. In Vercel → **New Project** → import from Git
3. Add environment variables in Vercel settings
4. Vercel will auto-detect `vercel.json` and deploy

---

## Step 4: Connect Frontend to Backend

Update `VITE_API_BASE_URL` in Netlify environment variables to point to your Vercel backend URL (e.g., `https://your-backend.vercel.app`).

---

## Quick Reference

| Service | Purpose | Config File |
|---|---|---|
| Supabase | Database + Auth + Storage | `supabase-schema.sql` |
| Netlify | Frontend hosting | `frontend/netlify.toml` |
| Vercel | Backend API hosting | `backend/vercel.json` |

---

## Admin Usage

1. Go to `https://your-site.netlify.app/login`
2. Sign in with your Supabase admin credentials
3. Use the dashboard to add/edit/delete projects
4. Visitors see the public portfolio (no login required)
