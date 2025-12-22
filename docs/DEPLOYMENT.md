# Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Recipe application to Cloudflare.

## Deployment Architecture

```mermaid
graph TB
    subgraph "Local Development"
        Code[Source Code]
        Build[Build Process]
    end
    
    subgraph "Cloudflare Platform"
        Worker[Worker Deployment]
        Pages[Pages Deployment]
        Hyperdrive[Hyperdrive Config]
    end
    
    subgraph "External Services"
        Firebase[Firebase Auth]
        Aiven[Aiven PostgreSQL]
    end
    
    Code -->|wrangler deploy| Worker
    Code -->|npm build| Build
    Build -->|wrangler pages deploy| Pages
    
    Worker --> Hyperdrive
    Hyperdrive --> Aiven
    Worker --> Firebase
    Pages --> Worker
    
    style Worker fill:#f9a825
    style Pages fill:#f9a825
    style Firebase fill:#ff6f00
    style Aiven fill:#10b981
```

## Prerequisites

### Required Accounts
- ✅ Cloudflare account (free tier works)
- ✅ Firebase project
- ✅ Aiven PostgreSQL database

### Required Tools
- ✅ Node.js 18+
- ✅ Wrangler CLI (`npm install -g wrangler`)
- ✅ Git

### Required Information
- Firebase Web API Key
- Aiven PostgreSQL connection string
- Cloudflare account access

## Initial Setup (One-Time)

### 1. Install Wrangler

```bash
npm install -g wrangler
```

**Verify installation:**
```bash
wrangler --version
# Should show: ⛅️ wrangler 4.56.0 or higher
```

### 2. Login to Cloudflare

```bash
wrangler login
```

This will open a browser window for OAuth authentication.

### 3. Create Hyperdrive Connection

```bash
cd worker

wrangler hyperdrive create recipe-db \
  --connection-string="postgresql://avnadmin:PASSWORD@HOST:PORT/defaultdb?sslmode=require"
```

**Save the Hyperdrive ID** from the output.

### 4. Update Worker Configuration

Edit `worker/wrangler.toml`:
```toml
[[hyperdrive]]
binding = "DB"
id = "YOUR_HYPERDRIVE_ID"  # Replace with actual ID
```

### 5. Configure Worker Secrets

```bash
cd worker

# Set Firebase API Key
echo "AIzaSyC9_ydhjHLdKJ_GReay_hHV1zj9-CCyQ2s" | wrangler secret put FIREBASE_API_KEY
```

### 6. Configure Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: `recipe-c4973`
3. Authentication → Settings → Authorized domains
4. Add:
   - `cc85b067.recipe-app-17d.pages.dev`
   - `recipe-app-17d.pages.dev`
   - `chertech.org` (if using custom domain)

## Deployment Process

### Deploy Worker (Backend API)

```mermaid
flowchart LR
    A[Edit Code] --> B[Test Locally]
    B --> C[wrangler deploy]
    C --> D[Verify Deployment]
    D --> E{Working?}
    E -->|Yes| F[Done]
    E -->|No| G[Check Logs]
    G --> A
    
    style C fill:#f9a825
    style F fill:#4caf50
```

**Step-by-Step:**

1. **Navigate to worker directory:**
   ```bash
   cd worker
   ```

2. **Deploy to Cloudflare:**
   ```bash
   wrangler deploy
   ```

3. **Verify deployment:**
   ```bash
   curl https://recipe-api.er1278.workers.dev/health
   ```

   Expected response:
   ```json
   {"status":"ok","timestamp":"2024-12-21T..."}
   ```

4. **Check logs:**
   ```bash
   wrangler tail
   ```

### Deploy Frontend (React App)

```mermaid
flowchart LR
    A[Update Code] --> B[Update .env.production]
    B --> C[npm run build]
    C --> D[wrangler pages deploy]
    D --> E[Verify Deployment]
    E --> F{Working?}
    F -->|Yes| G[Done]
    F -->|No| H[Check Browser Console]
    H --> A
    
    style C fill:#2196f3
    style D fill:#f9a825
    style G fill:#4caf50
```

**Step-by-Step:**

1. **Navigate to UI directory:**
   ```bash
   cd ui
   ```

2. **Verify environment variables:**
   
   Check `ui/.env.production`:
   ```env
   REACT_APP_API_URL=https://recipe-api.er1278.workers.dev
   ```

3. **Build production bundle:**
   ```bash
   npm run build
   ```

   This creates optimized files in `ui/build/`

4. **Deploy to Cloudflare Pages:**
   ```bash
   wrangler pages deploy build --project-name=recipe-app --branch=main
   ```

   > **Note:** Always use `--branch=main` to deploy to production. The production branch is configured as `main` in Cloudflare Pages.

   **First time:** You'll be prompted to:
   - Create new project (select "Create a new project")
   - Enter production branch name (use "main")

5. **Note the deployment URL:**
   ```
   ✨ Deployment complete!
   https://cc85b067.recipe-app-17d.pages.dev
   ```

6. **Test the deployment:**
   - Open URL in browser
   - Try signing in
   - Verify recipes load

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass locally
- [ ] Environment variables configured
- [ ] Firebase authorized domains updated
- [ ] Database migrations applied (if any)
- [ ] Code committed to Git

### Worker Deployment

- [ ] `cd worker`
- [ ] `wrangler deploy`
- [ ] Test health endpoint
- [ ] Check Worker logs
- [ ] Test API endpoints with token

### Frontend Deployment

- [ ] `cd ui`
- [ ] Verify `.env.production`
- [ ] `npm run build`
- [ ] `wrangler pages deploy build --project-name=recipe-app`
- [ ] Test in browser
- [ ] Verify authentication works
- [ ] Test recipe operations

### Post-Deployment

- [ ] Smoke test all features
- [ ] Check error logs
- [ ] Monitor performance
- [ ] Update documentation (if needed)

## Updating Existing Deployment

### Update Worker Only

```bash
cd worker
# Make code changes
wrangler deploy
wrangler tail  # Monitor logs
```

### Update Frontend Only

```bash
cd ui
# Make code changes
npm run build
wrangler pages deploy build --project-name=recipe-app --branch=main
```

### Update Both

```bash
# Deploy Worker
cd worker
wrangler deploy

# Deploy Frontend
cd ../ui
npm run build
wrangler pages deploy build --project-name=recipe-app --branch=main
```

## Rollback Procedure

### Rollback Worker

```bash
cd worker

# List recent deployments
wrangler deployments list

# Rollback to specific version
wrangler rollback [VERSION_ID]
```

### Rollback Frontend

1. Go to Cloudflare Dashboard
2. Pages → recipe-app
3. Deployments tab
4. Find previous deployment
5. Click "Rollback to this deployment"

## Environment-Specific Deployments

### Development Environment

```bash
# Worker
cd worker
wrangler deploy --env dev

# Frontend
cd ui
npm run build
wrangler pages deploy build --project-name=recipe-app-dev
```

### Production Environment

```bash
# Worker
cd worker
wrangler deploy --env=""

# Frontend  
cd ui
npm run build
wrangler pages deploy build --project-name=recipe-app --branch=main
```

## Custom Domain Setup

### Configure Custom Domain for Pages

1. **Cloudflare Dashboard:**
   - Pages → recipe-app
   - Custom domains → Add custom domain
   - Enter: `chertech.org`

2. **Update DNS:**
   - Add CNAME record: `chertech.org` → `recipe-app-17d.pages.dev`

3. **Update Frontend:**
   ```bash
   cd ui
   # Update .env.production if needed
   npm run build
   wrangler pages deploy build --project-name=recipe-app
   ```

4. **Update Firebase:**
   - Add `chertech.org` to authorized domains

### Configure Custom Domain for Worker

1. **Cloudflare Dashboard:**
   - Workers & Pages → recipe-api
   - Triggers → Custom Domains
   - Add: `api.chertech.org`

2. **Update DNS:**
   - Add CNAME record: `api.chertech.org` → `recipe-api.er1278.workers.dev`

3. **Update Frontend:**
   ```bash
   cd ui
   # Edit .env.production
   # REACT_APP_API_URL=https://api.chertech.org
   npm run build
   wrangler pages deploy build --project-name=recipe-app
   ```

## Monitoring Deployments

### Worker Metrics

**Cloudflare Dashboard:**
- Workers & Pages → recipe-api → Metrics
- View: Requests, Errors, CPU Time

**Command Line:**
```bash
wrangler tail
```

### Pages Metrics

**Cloudflare Dashboard:**
- Pages → recipe-app → Analytics
- View: Requests, Bandwidth, Build time

### Database Monitoring

**Aiven Console:**
- https://console.aiven.io
- View: Connections, Queries, Performance

## Troubleshooting Deployments

### Worker Deployment Fails

**Error: "Authentication required"**
```bash
wrangler logout
wrangler login
wrangler deploy
```

**Error: "Hyperdrive binding not found"**
- Check `wrangler.toml` has correct Hyperdrive ID
- Verify Hyperdrive exists in dashboard

### Pages Deployment Fails

**Error: "Build failed"**
```bash
# Check build locally
cd ui
npm run build

# If successful, try deploy again
wrangler pages deploy build --project-name=recipe-app
```

**Error: "Project not found"**
- Create project first in Cloudflare Dashboard
- Or let wrangler create it during first deploy

### Post-Deployment Issues

**API returns 500 errors:**
```bash
# Check Worker logs
wrangler tail

# Common causes:
# - Database connection issue
# - Missing secrets
# - Code error
```

**Frontend shows blank page:**
- Check browser console for errors
- Verify API URL in `.env.production`
- Check CORS configuration

**Authentication not working:**
- Verify Firebase authorized domains
- Check Firebase API key in Worker secrets
- Test token generation in browser console

## Deployment Best Practices

### 1. Test Before Deploy
```bash
# Always test locally first
cd worker && wrangler dev
cd ui && npm start
```

### 2. Deploy Worker First
```bash
# Deploy backend before frontend
cd worker && wrangler deploy
cd ../ui && npm run build && wrangler pages deploy build
```

### 3. Monitor After Deploy
```bash
# Watch logs for errors
wrangler tail
```

### 4. Keep Secrets Secure
- Never commit secrets to Git
- Use `wrangler secret put` for sensitive data
- Rotate secrets periodically

### 5. Version Control
```bash
# Tag releases
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

## Automated Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy-worker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g wrangler
      - run: cd worker && npm install
      - run: cd worker && wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  deploy-pages:
    runs-on: ubuntu-latest
    needs: deploy-worker
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd ui && npm install
      - run: cd ui && npm run build
      - run: wrangler pages deploy ui/build --project-name=recipe-app
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## Quick Reference

### Common Commands

```bash
# Deploy Worker
cd worker && wrangler deploy

# Deploy Pages (to main branch for production)
cd ui && npm run build && wrangler pages deploy build --project-name=recipe-app --branch=main

# View Worker logs
wrangler tail

# List deployments
wrangler deployments list

# Rollback Worker
wrangler rollback [VERSION_ID]
```

### URLs

- **Worker API**: https://recipe-api.er1278.workers.dev
- **Pages App**: https://cc85b067.recipe-app-17d.pages.dev
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Firebase Console**: https://console.firebase.google.com
- **Aiven Console**: https://console.aiven.io
