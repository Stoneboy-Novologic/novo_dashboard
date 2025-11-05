# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Construction Management SaaS Dashboard frontend to Vercel.

## Overview

The frontend is a Next.js 16 application built within an Nx monorepo. This guide covers the deployment process specifically for the frontend application located in `apps/app`.

## Prerequisites

- GitHub account with access to the repository
- Vercel account (free tier available)
- Repository pushed to GitHub: `git@github.com:AmanVatsSharma/construction-mnagement-v1.git`

## Step-by-Step Deployment

### 1. Connect Repository to Vercel

1. **Log in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Search for `AmanVatsSharma/construction-mnagement-v1`
   - Click "Import"

### 2. Configure Project Settings

Vercel should auto-detect Next.js, but you may need to configure the following:

#### Framework Preset
- **Framework Preset**: `Next.js` (auto-detected)

#### Build Settings
- **Root Directory**: Leave as `/` (root of monorepo) - **IMPORTANT**: Do not change this to `apps/app`
- **Build Command**: `npx nx build app`
- **Output Directory**: `dist/apps/app/.next`
- **Install Command**: `npm install --legacy-peer-deps`

#### Environment Variables
Click "Environment Variables" and add the following:

**Required Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
```

**Optional Variables (if using OAuth):**
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

**Note**: 
- All environment variables that should be accessible in the browser must be prefixed with `NEXT_PUBLIC_`
- Replace `your-backend-api-url.com` with your actual backend API URL (e.g., if backend is deployed separately)

### 3. Deploy

1. Click "Deploy" button
2. Wait for the build to complete (typically 2-5 minutes)
3. Once deployed, you'll receive a URL like: `https://construction-mnagement-v1.vercel.app`

## Configuration Files

### vercel.json

The project includes a `vercel.json` file in the root directory with the following configuration:

```json
{
  "version": 2,
  "buildCommand": "npx nx build app",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs"
}
```

**Note**: The `outputDirectory` is intentionally omitted to allow Vercel's Next.js framework detection to automatically locate the `.next` folder and properly resolve `node_modules` paths. This is the recommended approach for Next.js deployments on Vercel.

This configuration ensures:
- Nx builds the `app` project correctly
- Output is directed to the correct directory
- Next.js framework is properly detected

### .vercelignore

The `.vercelignore` file excludes unnecessary files from deployment:
- Backend API code (`apps/api/`)
- Documentation files
- Test files
- Development-only files

## Monorepo-Specific Considerations

### Why Root Directory Must Be `/`

Since this is an Nx monorepo, Vercel must build from the repository root because:
1. Nx needs access to the entire workspace structure
2. Shared libraries in `libs/shared/` must be available during build
3. The `nx.json` and `tsconfig.base.json` files are in the root

### Build Process Flow

```
1. Vercel installs dependencies (npm install)
2. Nx builds shared libraries first (automatic dependency resolution)
3. Nx builds the Next.js app (apps/app)
4. Output is generated in dist/apps/app
5. Vercel serves the Next.js application
```

## Environment Variables Reference

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes | `https://api.example.com` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | No | `123456789.apps.googleusercontent.com` |
| `NEXT_PUBLIC_MICROSOFT_CLIENT_ID` | Microsoft OAuth Client ID | No | `abc123-def456` |

### Backend Environment Variables (Not Used in Frontend)

These are only needed for backend deployment (not in Vercel):
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET`
- `GOOGLE_CLIENT_SECRET`, `MICROSOFT_CLIENT_SECRET`

## Troubleshooting

### Build Fails with "Cannot find module"

**Problem**: Nx cannot find shared libraries or dependencies.

**Solution**:
1. Ensure `Root Directory` is set to `/` (root of repo)
2. Verify `package.json` includes all dependencies
3. Check that `libs/shared/` directories exist in the repository

### Build Fails with "Output directory not found"

**Problem**: Vercel cannot find the build output.

**Solution**:
1. **Do NOT specify `outputDirectory` in `vercel.json`** - Vercel will auto-detect Next.js build output
2. Check that the build command completes successfully: `npx nx build app`
3. Verify that `.next` folder is created (either in `apps/app/.next` or `dist/apps/app/.next`)
4. Ensure `framework: "nextjs"` is set in `vercel.json` to enable automatic detection
5. In Vercel dashboard → Settings → General → Root Directory: Leave as `/` (root of monorepo)

### Routes Manifest Not Found

**Problem**: Error: "The file routes-manifest.json couldn't be found"

**Solution**:
1. **Do NOT specify `outputDirectory` in `vercel.json`** - Let Vercel's Next.js framework detection automatically locate the `.next` folder
2. In Vercel dashboard → Settings → General → Root Directory: Leave as `/` (don't change to `apps/app`)
3. Verify the build completes successfully and check build logs for `.next` folder creation
4. Ensure `framework: "nextjs"` is set in `vercel.json` to enable automatic detection
5. **Note**: Omitting `outputDirectory` allows Vercel to properly resolve `node_modules` paths and find Next.js build artifacts automatically

### Node Modules Not Found (ENOENT errors)

**Problem**: Error: "ENOENT: no such file or directory, lstat '/vercel/path0/dist/node_modules/client-only/index.js'"

**Solution**:
1. **Do NOT specify `outputDirectory` in `vercel.json`** - This allows Vercel to properly resolve relative paths from `.next` to `node_modules`
2. Ensure `framework: "nextjs"` is set in `vercel.json`
3. Verify that `node_modules` exists at the repository root (not inside `dist`)
4. The `.next` folder contains relative paths like `../../../node_modules/` which resolve correctly when Vercel auto-detects the build output
5. If you must specify `outputDirectory`, ensure it points to the directory containing `.next` (not the `.next` folder itself), and that Vercel can access `node_modules` from the workspace root

### Environment Variables Not Working

**Problem**: `process.env.NEXT_PUBLIC_*` variables are undefined.

**Solution**:
1. Ensure variables are prefixed with `NEXT_PUBLIC_`
2. Redeploy after adding environment variables
3. Check Vercel dashboard → Settings → Environment Variables

### API Calls Failing

**Problem**: Frontend cannot connect to backend API.

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Ensure backend API is deployed and accessible
3. Check CORS settings on backend if API is on different domain
4. Verify API URL doesn't have trailing slash

## Custom Domain Setup

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificates

## Continuous Deployment

Vercel automatically deploys when you push to:
- `main` branch → Production deployment
- Other branches → Preview deployments

Each pull request gets its own preview URL for testing.

## Performance Optimization

### Build Time Optimization

- Nx caching is automatically used
- Vercel caches `node_modules` between deployments
- The `--legacy-peer-deps` flag is used to handle dependency resolution issues

### Runtime Optimization

- Next.js automatically optimizes images (if configured)
- Static pages are automatically pre-rendered
- API routes are serverless functions

## Monitoring and Analytics

The project includes `@vercel/analytics` for monitoring:
- Page views
- Performance metrics
- User interactions

Analytics are automatically enabled when deployed to Vercel.

## Rollback Deployment

If a deployment has issues:

1. Go to Deployments tab
2. Find the previous working deployment
3. Click "..." menu → "Promote to Production"

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Nx Monorepo Guide](https://nx.dev)

## Support

For issues specific to this project:
1. Check build logs in Vercel dashboard
2. Review error messages in deployment logs
3. Verify environment variables are set correctly
4. Check GitHub repository for latest updates

