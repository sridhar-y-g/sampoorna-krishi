# Guide: Hosting Sampoorna Krishi (Frontend & Backend)

This guide provides a step-by-step process for deploying the **Next.js Frontend** and the **FastAPI Backend** online for free.

---

## ☁️ Deployment Overview
*   **Database**: Already hosted on **TiDB Cloud** (configured via `.env` connection string). No additional setup is required.
*   **Backend (FastAPI)**: Hosted on **Render** (free tier).
*   **Frontend (Next.js)**: Hosted on **Vercel** (free tier).

---

## 🛠️ Step 1: Push Your Code to GitHub
To host on Vercel and Render, your project files must be on GitHub.

1. Go to [GitHub](https://github.com/) and create a free account if you do not have one.
2. Create a new repository named `sampoorna-krishi` (keep it private or public).
3. Install Git if you don't have it, then run these commands in the terminal inside `SMPKirshi-main`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sampoorna-krishi.git
   git push -u origin main
   ```

---

## 🐍 Step 2: Host the Backend on Render
Render automatically detects Python applications and hosts them for free.

1. Go to [Render](https://render.com/) and sign up using your GitHub account.
2. Click **New +** and select **Web Service**.
3. Connect your `sampoorna-krishi` GitHub repository.
4. Set the following build settings:
   *   **Root Directory**: `backend` (if you pushed backend separately, or leave empty if backend is in root folder)
   *   **Runtime**: `Python 3`
   *   **Build Command**: `pip install -r requirements.txt`
   *   **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Click **Advanced** and add the **Environment Variables**:
   *   `DATABASE_URL`: `mysql+pymysql://3KygEpsFHKTdFHe.root:WSqw2lEj9VPOzKHM@gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com:4000/test`
   *   `SECRET_KEY`: `sampoorna-krishi-super-secret-jwt-key-change-in-production-2024`
6. Click **Deploy Web Service**. Render will generate a URL like `https://sampoorna-backend.onrender.com`.

---

## ⚛️ Step 3: Host the Frontend on Vercel
Vercel is the official host for Next.js and deploys it automatically.

1. Go to [Vercel](https://vercel.com/) and sign up using your GitHub account.
2. Click **Add New** > **Project**.
3. Import your `sampoorna-krishi` repository.
4. Vercel will auto-detect Next.js.
5. In the **Environment Variables** section, add:
   *   Key: `NEXT_PUBLIC_API_URL`
   *   Value: `https://sampoorna-backend.onrender.com/api` (this is the Render backend URL you created in Step 2)
6. Add the AI and Weather API keys so that Server Actions can connect to them:
   *   Key: `GEMINI_API_KEY`
   *   Value: `AIzaSyCqpG6ypuS7hM0mnriVUqlE_pKbjBb1wpk` (or your custom Gemini key)
   *   Key: `OPENWEATHER_API_KEY`
   *   Value: `0b43bc517b9250fe6cbf0e4425591e30` (or your custom OpenWeather key)
7. Click **Deploy**. Vercel will compile and host the app, providing a URL like `https://sampoorna-krishi.vercel.app`.

---

## 🔑 4. API Keys & Configuration Reference
During local development, these keys are stored in the `.env` files in your project directory:
1. **`GEMINI_API_KEY`**: Used by Google Genkit AI inside `src/ai/genkit.ts` to power crop diagnosis, fertilizer advisories, farming tips, and subsidy search.
2. **`OPENWEATHER_API_KEY`**: Used inside `src/ai/flows/weather-advisory.ts` to retrieve current weather parameters (temperature, wind, rain) for localized farming recommendations.

> [!IMPORTANT]
> When hosting, always enter these keys in the **Vercel Project Dashboard** (under Settings > Environment Variables) so they are securely available to the Next.js server-side environment. Do not commit sensitive keys directly to public repositories.
