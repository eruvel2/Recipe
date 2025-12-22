# Development Guide

## Development Tools

### Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Node.js** | 18+ | JavaScript runtime | https://nodejs.org |
| **npm** | 9+ | Package manager | Included with Node.js |
| **Wrangler** | 3.78+ | Cloudflare CLI | `npm install -g wrangler` |
| **Git** | Latest | Version control | https://git-scm.com |

### Optional Tools

| Tool | Purpose |
|------|---------|
| **VS Code** | Recommended IDE |
| **Postman** | API testing |
| **pgAdmin** | Database management |

## Platform Services

### Cloudflare
- **Workers**: Serverless API hosting
- **Pages**: Static site hosting
- **Hyperdrive**: PostgreSQL connection pooling
- **Dashboard**: https://dash.cloudflare.com

### Firebase
- **Authentication**: Google OAuth provider
- **Console**: https://console.firebase.google.com
- **Project**: `recipe-c4973`

### Aiven
- **PostgreSQL**: Managed database
- **Console**: https://console.aiven.io
- **Database**: `defaultdb`

## Platform Interactions

```mermaid
graph TB
    subgraph "Development Tools"
        VSCode[VS Code / IDE]
        Wrangler[Wrangler CLI]
        npm[npm]
    end
    
    subgraph "Cloudflare Platform"
        Pages[Pages]
        Workers[Workers]
        Hyperdrive[Hyperdrive]
        Dashboard[Dashboard]
    end
    
    subgraph "External Platforms"
        Firebase[Firebase Auth]
        Aiven[Aiven PostgreSQL]
    end
    
    VSCode -->|Edit Code| npm
    npm -->|Build| Wrangler
    Wrangler -->|Deploy| Pages
    Wrangler -->|Deploy| Workers
    Wrangler -->|Configure| Hyperdrive
    Dashboard -->|Manage| Workers
    Dashboard -->|Manage| Pages
    Dashboard -->|Manage| Hyperdrive
    
    Workers -->|Authenticate| Firebase
    Hyperdrive -->|Connect| Aiven
    
    style Wrangler fill:#f9a825
    style Firebase fill:#ff6f00
    style Aiven fill:#10b981
```

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd Recipe
```

### 2. Install Dependencies

**Frontend:**
```bash
cd ui
npm install
```

**Worker:**
```bash
cd worker
npm install
```

### 3. Configure Environment Variables

#### Frontend (`ui/.env.development`)
```env
REACT_APP_API_URL=http://localhost:8787
```

#### Frontend (`ui/.env.production`)
```env
REACT_APP_API_URL=https://recipe-api.er1278.workers.dev
```

#### Worker Secrets
```bash
cd worker
echo "YOUR_FIREBASE_API_KEY" | wrangler secret put FIREBASE_API_KEY
```

### 4. Configure Firebase

**Get Firebase Config:**
1. Go to Firebase Console → Project Settings
2. Copy Web API Key: `AIzaSyC9_ydhjHLdKJ_GReay_hHV1zj9-CCyQ2s`
3. Add to `ui/src/components/firebase.js`

**Add Authorized Domains:**
1. Firebase Console → Authentication → Settings
2. Add domains:
   - `localhost`
   - `cc85b067.recipe-app-17d.pages.dev`
   - `chertech.org` (if using custom domain)

### 5. Configure Hyperdrive

**Create Hyperdrive Connection:**
```bash
cd worker
wrangler hyperdrive create recipe-db \
  --connection-string="postgresql://USER:PASSWORD@HOST:PORT/defaultdb?sslmode=require"
```

**Update `wrangler.toml`:**
```toml
[[hyperdrive]]
binding = "DB"
id = "YOUR_HYPERDRIVE_ID"
```

## Local Development

### Running Frontend

```bash
cd ui
npm start
```

- Opens at: http://localhost:3000
- Hot reload enabled
- Uses `.env.development` for API URL

### Running Worker

```bash
cd worker
wrangler dev
```

- Runs at: http://localhost:8787
- Live reload on code changes
- **Note**: Requires local PostgreSQL for Hyperdrive emulation, or deploy to test with actual database

### Testing Full Stack Locally

1. **Start Worker:**
   ```bash
   cd worker
   wrangler dev
   ```

2. **Start Frontend:**
   ```bash
   cd ui
   npm start
   ```

3. **Access app:** http://localhost:3000

## Development Workflow

```mermaid
flowchart TD
    A[Write Code] --> B[Test Locally]
    B --> C{Tests Pass?}
    C -->|No| A
    C -->|Yes| D[Commit to Git]
    D --> E[Deploy to Cloudflare]
    E --> F[Test Production]
    F --> G{Works?}
    G -->|No| H[Check Logs]
    H --> A
    G -->|Yes| I[Done]
    
    style A fill:#2196f3
    style E fill:#f9a825
    style I fill:#4caf50
```

### Best Practices

1. **Always test locally** before deploying
2. **Use environment variables** for configuration
3. **Check Worker logs** after deployment
4. **Test authentication flow** in production
5. **Monitor database connections** via Aiven console

## Code Structure

### Frontend (`ui/src/`)

```
src/
├── App.js                 # Main app, auth state management
├── components/
│   ├── Login.js          # Google Sign-In component
│   ├── Recipes.js        # Main recipes view
│   ├── Details.js        # Recipe details/edit
│   ├── List.js           # Recipe list display
│   ├── Search.js         # Search functionality
│   ├── Categories.js     # Category filter
│   └── firebase.js       # Firebase configuration
└── index.js              # React entry point
```

### Worker (`worker/src/`)

```
src/
├── index.js              # Main Worker, routes
├── auth.js               # Firebase auth middleware
└── db.js                 # Database query functions
```

## API Development

### Adding New Endpoint

1. **Define route in `worker/src/index.js`:**
   ```javascript
   app.get('/api/new-endpoint', verifyFirebaseToken, verifyUserInDB, async (c) => {
     // Your logic here
     return c.json({ data: 'response' });
   });
   ```

2. **Add database query in `worker/src/db.js`** (if needed)

3. **Test locally:**
   ```bash
   curl http://localhost:8787/api/new-endpoint \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Deploy:**
   ```bash
   wrangler deploy
   ```

### Testing API Endpoints

**Using curl:**
```bash
# Get Firebase token from browser (F12 → Application → Local Storage)
TOKEN="your_firebase_token"

# Test endpoint
curl https://recipe-api.er1278.workers.dev/api/recipes \
  -H "Authorization: Bearer $TOKEN"
```

**Using Postman:**
1. Set Authorization → Bearer Token
2. Add Firebase ID token
3. Send request

## Database Development

### Connecting to Database

**Connection String:**
```
postgresql://avnadmin:PASSWORD@pg-d45ea2f-chertech.g.aivencloud.com:10197/defaultdb?sslmode=require
```

**Using psql:**
```bash
psql "postgresql://avnadmin:PASSWORD@HOST:PORT/defaultdb?sslmode=require"
```

### Running Migrations

```sql
-- Add new column
ALTER TABLE recipe ADD COLUMN new_field VARCHAR(255);

-- Create index
CREATE INDEX idx_recipe_category ON recipe(category);
```

### Viewing Data

```sql
-- List all recipes
SELECT * FROM recipe ORDER BY name;

-- List all users
SELECT * FROM users;

-- Check user permissions
SELECT email, updateable FROM users WHERE email = 'user@example.com';
```

## Common Development Tasks

### Update Frontend API URL

1. Edit `ui/.env.production`
2. Rebuild: `npm run build`
3. Redeploy: `wrangler pages deploy build --project-name=recipe-app`

### Add New User to Database

```sql
INSERT INTO users (email, updateable) VALUES ('user@example.com', true);
```

### Update CORS Origins

1. Edit `worker/src/index.js`
2. Update `allowedOrigins` array
3. Deploy: `wrangler deploy`

### View Worker Logs

```bash
wrangler tail
```

Or in Cloudflare Dashboard → Workers & Pages → recipe-api → Logs

## Troubleshooting

### Frontend won't start
```bash
cd ui
rm -rf node_modules package-lock.json
npm install
npm start
```

### Worker deployment fails
```bash
# Check wrangler version
wrangler --version

# Re-login
wrangler logout
wrangler login

# Try deploy again
wrangler deploy
```

### Database connection issues
- Check Hyperdrive configuration in `wrangler.toml`
- Verify connection string in Aiven console
- Check Hyperdrive status in Cloudflare Dashboard

### Authentication not working
- Verify Firebase authorized domains
- Check Firebase API key in Worker secrets
- Inspect browser console for errors
