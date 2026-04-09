# Love Link

## Project Info

This repository is configured to run independently with your own Supabase project.

## Live Site

- Production URL: `https://lovelink.merchandice.in`
- Hosting: GitHub Pages (GitHub Actions deploy)

## Run Locally

Prerequisite: Node.js + npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deploy to GitHub Pages

This repository deploys automatically via `.github/workflows/deploy-pages.yml`.

### 1) Configure GitHub Pages

- Open **Settings > Pages**
- Set **Source** to **GitHub Actions**

### 2) Add build variables

In **Settings > Secrets and variables > Actions**:

- Add **Variables**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PROJECT_ID` (optional)
  - `VITE_BASE_PATH` = `/`
- Add **Secret**:
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

`/` is required because this project uses a custom domain root.

### 3) Push to `main`

Each push to `main` triggers deployment and publishes `dist`.

### 4) Configure Supabase auth redirects

In Supabase Auth URL settings, add these redirect URLs:

- `https://lovelink.merchandice.in/auth`

Set **Site URL** to:

- `https://lovelink.merchandice.in`

## Custom domain on GitHub Pages

Already configured for `lovelink.merchandice.in`.

If you change domains later:

1. Update `public/CNAME`
2. Update domain URLs in `index.html`, `public/sitemap.xml`, and `public/robots.txt`
3. Update Supabase Auth redirect URL + Site URL
4. Update DNS records in your domain provider and re-enable HTTPS in GitHub Pages

## Local Env File

Use `.env` (not committed) with:

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`
