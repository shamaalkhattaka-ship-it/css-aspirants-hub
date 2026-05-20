# CSS Aspirants Hub — Deployment Guide

## What's in this project

- `src/App.js` — Main React app (your original site + Live News tab)
- `api/news.js` — Serverless function: proxies NewsAPI (bypasses CORS)
- `api/rss.js` — Serverless function: fetches & parses Dawn, Tribune, Geo RSS feeds
- `vercel.json` — Routing config for Vercel
- `.env` — Local environment variables

---

## Deploy to Vercel (Free — 10 minutes)

### Step 1: Create a GitHub repository

1. Go to https://github.com and sign in (or create a free account)
2. Click **"New repository"**
3. Name it `css-aspirants-hub`
4. Set it to **Public** (free tier)
5. Click **"Create repository"**

### Step 2: Upload your files

Option A — GitHub Desktop (easiest):
1. Download GitHub Desktop: https://desktop.github.com
2. Clone your new repo
3. Copy all files from this folder into the repo folder
4. Commit and push

Option B — Command line:
```bash
cd css-hub
git init
git add .
git commit -m "Initial deploy"
git remote add origin https://github.com/YOUR_USERNAME/css-aspirants-hub.git
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com and click **"Sign Up"**
2. Choose **"Continue with GitHub"**
3. Click **"Add New Project"**
4. Select your `css-aspirants-hub` repository
5. Vercel auto-detects React — click **"Deploy"**

### Step 4: Add your NewsAPI key as an environment variable

1. In your Vercel project, go to **Settings → Environment Variables**
2. Add:
   - **Name:** `NEWS_API_KEY`
   - **Value:** `4377b4352dae470da7f91a286661cd00`
3. Click **Save**
4. Go to **Deployments** and click **"Redeploy"**

### Step 5: Your site is live!

Vercel gives you a free URL like: `https://css-aspirants-hub.vercel.app`

Every time you push changes to GitHub, Vercel auto-deploys. Your live news updates automatically whenever a user visits.

---

## How the live news works

| Source | Type | Updates |
|--------|------|---------|
| Dawn (Home) | RSS | Every page load |
| Dawn (World) | RSS | Every page load |
| Dawn (Business) | RSS | Every page load |
| Express Tribune | RSS | Every page load |
| Geo News | RSS | Every page load |
| NewsAPI (Pakistan/Kashmir/etc) | API | Every refresh click |

## Adding more content

- **New issues:** Edit the `ISSUES` array in `src/App.js`
- **New flashcards:** Edit `FLASHCARDS` array
- **New quiz questions:** Edit `QUIZZES` object
- **New RSS feeds:** Add to the `feeds` array in `api/rss.js`
- **New NewsAPI topics:** Edit `NEWS_TOPICS` in `src/App.js`

## Upgrading NewsAPI

The free tier (developer plan) works for personal/study use.
For a public site with many users, upgrade at https://newsapi.org/pricing
