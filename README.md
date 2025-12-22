# Recipe Manager

A full-stack recipe management application deployed on Cloudflare with Firebase authentication and PostgreSQL database.

## 🌐 Live Application

- **Frontend**: https://cc85b067.recipe-app-17d.pages.dev
- **Backend API**: https://recipe-api.er1278.workers.dev

## 📋 Quick Links

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Debugging Guide](docs/DEBUGGING.md)

## 🚀 Features

- **Firebase Authentication**: Secure Google Sign-In
- **Recipe Management**: View, search, and update recipes
- **Category Filtering**: Browse recipes by category
- **Pagination**: Efficient recipe browsing
- **Responsive UI**: Works on desktop and mobile

## 🏗️ Technology Stack

### Frontend
- **React** - UI framework
- **Firebase Auth** - User authentication
- **Cloudflare Pages** - Hosting

### Backend
- **Cloudflare Workers** - Serverless API
- **Hono** - Lightweight web framework
- **Hyperdrive** - PostgreSQL connection pooling

### Database
- **Aiven PostgreSQL** - Managed database

## 📁 Project Structure

```
Recipe/
├── ui/                    # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   └── App.js        # Main app component
│   └── build/            # Production build
├── worker/               # Cloudflare Worker (API)
│   ├── src/
│   │   ├── index.js      # Main Worker entry
│   │   ├── auth.js       # Authentication middleware
│   │   └── db.js         # Database queries
│   └── wrangler.toml     # Worker configuration
├── server/               # Legacy Express server (deprecated)
└── docs/                 # Documentation
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Wrangler CLI (`npm install -g wrangler`)
- Cloudflare account
- Firebase project
- Aiven PostgreSQL database

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Recipe
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd ui
   npm install
   
   # Worker
   cd ../worker
   npm install
   ```

3. **Configure environment variables**
   - See [Development Guide](docs/DEVELOPMENT.md) for details

4. **Run locally**
   ```bash
   # Frontend (from ui/)
   npm start
   
   # Worker (from worker/)
   wrangler dev
   ```

## 📦 Deployment

See the [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**
```bash
# Deploy Worker
cd worker
wrangler deploy

# Deploy Frontend
cd ../ui
npm run build
wrangler pages deploy build --project-name=recipe-app --branch=main
```

> **Note:** Always use `--branch=main` to deploy to production. The production branch is configured as `main` in Cloudflare Pages.

## 🐛 Debugging

See the [Debugging Guide](docs/DEBUGGING.md) for troubleshooting tips and debugging with Antigravity.

## 📄 License

ISC

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- Cloudflare for Workers and Pages
- Firebase for authentication
- Aiven for PostgreSQL hosting
