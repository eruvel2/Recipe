# Architecture Overview

## System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end
    
    subgraph "Cloudflare Edge"
        Pages[Cloudflare Pages<br/>React App]
        Worker[Cloudflare Worker<br/>API Server]
    end
    
    subgraph "Authentication"
        Firebase[Firebase Auth<br/>Google OAuth]
    end
    
    subgraph "Data Layer"
        Hyperdrive[Hyperdrive<br/>Connection Pool]
        DB[(Aiven PostgreSQL<br/>Database)]
    end
    
    Browser -->|HTTPS| Pages
    Browser -->|Google Sign-In| Firebase
    Pages -->|API Calls| Worker
    Worker -->|Verify Token| Firebase
    Worker -->|SQL Queries| Hyperdrive
    Hyperdrive -->|Pooled Connection| DB
    
    style Pages fill:#f9a825
    style Worker fill:#f9a825
    style Firebase fill:#ff6f00
    style Hyperdrive fill:#0ea5e9
    style DB fill:#10b981
```

## Component Architecture

```mermaid
graph LR
    subgraph "Frontend (React)"
        App[App.js]
        Login[Login Component]
        Recipes[Recipes Component]
        Details[Details Component]
        List[List Component]
    end
    
    subgraph "Worker API"
        Router[Hono Router]
        AuthMW[Auth Middleware]
        DBModule[Database Module]
    end
    
    App --> Login
    App --> Recipes
    Recipes --> Details
    Recipes --> List
    
    Login -->|POST /api/verify-user| Router
    Recipes -->|GET /api/recipes| Router
    Details -->|PUT /api/recipes/:name| Router
    
    Router --> AuthMW
    AuthMW --> DBModule
    
    style App fill:#61dafb
    style Router fill:#f9a825
    style AuthMW fill:#ff6f00
    style DBModule fill:#0ea5e9
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant React
    participant Firebase
    participant Worker
    participant DB
    
    User->>React: Click "Sign in with Google"
    React->>Firebase: signInWithPopup()
    Firebase-->>React: ID Token + User Info
    
    React->>Worker: POST /api/verify-user<br/>(Bearer token)
    Worker->>Firebase: Verify token via REST API
    Firebase-->>Worker: Token valid + email
    Worker->>DB: SELECT * FROM users WHERE email=?
    
    alt User exists in DB
        DB-->>Worker: User record
        Worker-->>React: {success: true, user: {...}}
        React-->>User: Show Recipes
    else User not in DB
        DB-->>Worker: No record
        Worker-->>React: 403 Forbidden
        React->>Firebase: Sign out
        React-->>User: Show error
    end
```

## Data Flow

```mermaid
flowchart TD
    A[User Action] --> B{Authenticated?}
    B -->|No| C[Show Login]
    B -->|Yes| D[Get Firebase Token]
    D --> E[Make API Request]
    E --> F[Worker: Verify Token]
    F --> G{Token Valid?}
    G -->|No| H[Return 401]
    G -->|Yes| I[Worker: Check DB User]
    I --> J{User in DB?}
    J -->|No| K[Return 403]
    J -->|Yes| L[Execute Query]
    L --> M[Return Data]
    M --> N[Update UI]
    
    style C fill:#ff6f00
    style H fill:#f44336
    style K fill:#f44336
    style N fill:#4caf50
```

## Technology Stack Details

### Frontend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.x |
| Firebase SDK | Authentication | 12.6.0 |
| Lucide React | Icons | Latest |

### Backend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| Cloudflare Workers | Serverless Runtime | - |
| Hono | Web Framework | 4.x |
| postgres.js | PostgreSQL Driver | Latest |
| Hyperdrive | Connection Pooling | - |

### Infrastructure
| Service | Purpose | Provider |
|---------|---------|----------|
| Frontend Hosting | Static site hosting | Cloudflare Pages |
| API Hosting | Serverless functions | Cloudflare Workers |
| Authentication | User auth & OAuth | Firebase |
| Database | PostgreSQL | Aiven |
| Connection Pool | DB optimization | Cloudflare Hyperdrive |

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    email VARCHAR(255) PRIMARY KEY,
    updateable BOOLEAN DEFAULT false
);
```

### Recipe Table
```sql
CREATE TABLE recipe (
    "ID" SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    temperature VARCHAR(50),
    cooktime VARCHAR(50),
    ingredient1 TEXT,
    ingredient2 TEXT,
    -- ... up to ingredient25
    ingredient25 TEXT
);
```

## Security Model

### Authentication Layers

1. **Firebase Token Verification**
   - Validates JWT signature
   - Checks token expiration
   - Extracts user email

2. **Database User Verification**
   - Confirms email exists in `users` table
   - Retrieves user permissions (`updateable`)

3. **CORS Protection**
   - Whitelist of allowed origins
   - Credentials support enabled
   - Preflight request handling

### API Endpoints

| Endpoint | Method | Auth Required | DB Check | Purpose |
|----------|--------|---------------|----------|---------|
| `/health` | GET | ❌ | ❌ | Health check |
| `/api/verify-user` | POST | ✅ | ✅ | Verify user access |
| `/api/recipes` | GET | ✅ | ✅ | List recipes |
| `/api/recipes/:name` | GET | ✅ | ✅ | Get recipe details |
| `/api/recipes/:name` | PUT | ✅ | ✅ | Update recipe |

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        Dev[Developer]
        Git[Git Repository]
    end
    
    subgraph "CI/CD"
        Wrangler[Wrangler CLI]
    end
    
    subgraph "Cloudflare"
        Pages[Pages Deployment]
        Worker[Worker Deployment]
        Hyperdrive[Hyperdrive Config]
    end
    
    subgraph "External Services"
        Firebase[Firebase Project]
        Aiven[Aiven PostgreSQL]
    end
    
    Dev -->|Push Code| Git
    Dev -->|wrangler deploy| Wrangler
    Wrangler -->|Deploy Frontend| Pages
    Wrangler -->|Deploy API| Worker
    Worker -->|Uses| Hyperdrive
    Hyperdrive -->|Connects to| Aiven
    Worker -->|Verifies with| Firebase
    Pages -->|Calls| Worker
    
    style Dev fill:#9e9e9e
    style Pages fill:#f9a825
    style Worker fill:#f9a825
    style Firebase fill:#ff6f00
    style Aiven fill:#10b981
```

## Performance Optimizations

### Cloudflare Edge
- **Global CDN**: Frontend served from 300+ locations
- **Edge caching**: Static assets cached at edge
- **HTTP/3**: Modern protocol support

### Hyperdrive
- **Connection pooling**: Reuses database connections
- **Query caching**: Caches frequent queries
- **Regional optimization**: Routes to nearest database

### Frontend
- **Code splitting**: Lazy loading components
- **Production build**: Minified and optimized
- **Asset optimization**: Compressed images and fonts

## Scalability Considerations

- **Serverless Workers**: Auto-scales with traffic
- **Database Connection Pool**: Handles concurrent requests
- **CDN Distribution**: Global availability
- **Stateless Architecture**: Horizontal scaling ready
