# Debugging Guide

## Debugging with Antigravity

Antigravity is an AI coding assistant that can help you debug issues in your Recipe application. This guide shows you how to effectively use Antigravity for debugging.

### Setting Up Debugging Environment

1. **Open Project in VS Code**
   ```bash
   cd c:\Workspace\Recipe
   code .
   ```

2. **Activate Antigravity**
   - Antigravity is available in your IDE
   - Use it to inspect code, set breakpoints, and analyze errors

### Common Debugging Scenarios

## 1. Debugging Frontend Issues

### Running Frontend Locally

```bash
cd ui
npm start
```

**Debugging with Antigravity:**

1. **View Component Code:**
   - Ask: "Show me the Login component"
   - Antigravity will display `ui/src/components/Login.js`

2. **Inspect Variables:**
   - Ask: "What variables are used in the Recipes component?"
   - Antigravity will analyze state variables, props, and local variables

3. **Add Console Logs:**
   - Ask: "Add console.log to track the user state in App.js"
   - Antigravity will add logging statements

4. **Check API Calls:**
   - Ask: "Show me all fetch calls in Recipes.js"
   - Antigravity will highlight all API requests

### Browser DevTools

**Open DevTools:** Press `F12` or `Ctrl+Shift+I`

**Console Tab:**
```javascript
// Check current user
console.log(auth.currentUser);

// Check API URL
console.log(process.env.REACT_APP_API_URL);

// Test API call
fetch('https://recipe-api.er1278.workers.dev/health')
  .then(r => r.json())
  .then(console.log);
```

**Network Tab:**
- Monitor API requests
- Check request headers (Authorization token)
- Inspect response status and body

**Application Tab:**
- View Local Storage (user data)
- Check Firebase authentication state

## 2. Debugging Worker (API) Issues

### Viewing Worker Logs

**Real-time logs:**
```bash
cd worker
wrangler tail
```

**Debugging with Antigravity:**

1. **Analyze Error Messages:**
   - Copy error from logs
   - Ask: "Why am I getting this error: [paste error]"
   - Antigravity will explain and suggest fixes

2. **Inspect Database Queries:**
   - Ask: "Show me the database query in the verify-user endpoint"
   - Antigravity will display the query code

3. **Add Logging:**
   - Ask: "Add console.log statements to track the authentication flow"
   - Antigravity will add strategic logging

### Testing Worker Locally

**Note:** Worker local testing requires local PostgreSQL setup for Hyperdrive emulation.

**Alternative - Test in Production:**
```bash
# Deploy to test
wrangler deploy

# Watch logs
wrangler tail
```

### Manual API Testing

**Get Firebase Token:**
1. Open app in browser
2. Sign in
3. Open DevTools → Console
4. Run: `auth.currentUser.getIdToken().then(console.log)`
5. Copy the token

**Test with curl:**
```bash
TOKEN="your_token_here"

# Test verify-user
curl https://recipe-api.er1278.workers.dev/api/verify-user \
  -X POST \
  -H "Authorization: Bearer $TOKEN"

# Test get recipes
curl https://recipe-api.er1278.workers.dev/api/recipes \
  -H "Authorization: Bearer $TOKEN"
```

## 3. Debugging Database Issues

### Connecting to Database

```bash
psql "postgresql://avnadmin:PASSWORD@pg-d45ea2f-chertech.g.aivencloud.com:10197/defaultdb?sslmode=require"
```

### Common Database Queries

```sql
-- Check if user exists
SELECT * FROM users WHERE email = 'user@example.com';

-- View all recipes
SELECT "ID", name, category FROM recipe LIMIT 10;

-- Check recipe by name
SELECT * FROM recipe WHERE name = 'Recipe Name';

-- View table structure
\d recipe
\d users
```

**Debugging with Antigravity:**

1. **Generate SQL Queries:**
   - Ask: "Write a SQL query to find all recipes in the 'Dessert' category"
   - Antigravity will generate the query

2. **Explain Query Errors:**
   - Paste SQL error
   - Ask: "Why is this SQL query failing?"
   - Antigravity will explain and fix

## 4. Debugging Authentication Issues

### Firebase Authentication

**Check Firebase Console:**
1. Go to https://console.firebase.google.com
2. Select project: `recipe-c4973`
3. Authentication → Users (verify user exists)
4. Authentication → Settings → Authorized domains

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "Unauthorized domain" | Add domain to Firebase authorized domains |
| "Invalid token" | Token expired, sign in again |
| "User not in database" | Add user email to `users` table |

**Debugging with Antigravity:**
- Ask: "Check if Firebase is configured correctly in firebase.js"
- Ask: "Why am I getting 'Unauthorized domain' error?"

## 5. Debugging CORS Issues

### Symptoms
- Error in browser console: "CORS policy blocked"
- Network tab shows failed OPTIONS request

### Check CORS Configuration

**Debugging with Antigravity:**
1. Ask: "Show me the CORS configuration in the Worker"
2. Ask: "Add my domain to the CORS allowed origins"

**Manual Fix:**
1. Edit `worker/src/index.js`
2. Add domain to `allowedOrigins` array:
   ```javascript
   const allowedOrigins = [
     'https://your-domain.com',
     // ... existing origins
   ];
   ```
3. Deploy: `wrangler deploy`

## 6. Debugging Hyperdrive Connection

### Check Hyperdrive Status

**Cloudflare Dashboard:**
1. Go to https://dash.cloudflare.com
2. Workers & Pages → Hyperdrive
3. Check connection status

**View Hyperdrive ID:**
```bash
cat worker/wrangler.toml | grep "id ="
```

**Debugging with Antigravity:**
- Ask: "Check if Hyperdrive is configured correctly in wrangler.toml"
- Ask: "How do I test the database connection?"

### Test Database Connection

```javascript
// Add to worker/src/index.js temporarily
app.get('/test-db', async (c) => {
  try {
    const result = await query(c.env.DB, 'SELECT 1 as test');
    return c.json({ success: true, result });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});
```

## Advanced Debugging Techniques

### Using Antigravity for Code Analysis

**1. Find All Error Handlers:**
```
Ask: "Show me all try-catch blocks in the Worker code"
```

**2. Trace Data Flow:**
```
Ask: "Trace how the recipe data flows from the database to the UI"
```

**3. Identify Performance Issues:**
```
Ask: "Are there any performance issues in the Recipes component?"
```

**4. Review Security:**
```
Ask: "Check if all API endpoints have proper authentication"
```

### Setting Breakpoints (Frontend)

**In Browser DevTools:**
1. Open Sources tab
2. Navigate to file (e.g., `Recipes.js`)
3. Click line number to set breakpoint
4. Trigger action (e.g., click button)
5. Inspect variables in Scope panel

**Using Antigravity:**
- Ask: "Where should I set a breakpoint to debug the recipe update function?"

### Analyzing Network Requests

**Check Request:**
```javascript
// In browser console
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('api'))
  .forEach(r => console.log(r.name, r.duration));
```

**Using Antigravity:**
- Ask: "Why is the /api/recipes request taking so long?"

## Troubleshooting Checklist

### Frontend Not Loading
- [ ] Check if `npm start` is running
- [ ] Verify `REACT_APP_API_URL` in `.env`
- [ ] Check browser console for errors
- [ ] Clear browser cache and reload

### API Returning 401 Unauthorized
- [ ] Check if user is signed in
- [ ] Verify Firebase token is being sent
- [ ] Check token expiration
- [ ] Verify Firebase API key in Worker secrets

### API Returning 403 Forbidden
- [ ] Check if user email exists in `users` table
- [ ] Verify database connection
- [ ] Check Hyperdrive status

### API Returning 500 Internal Server Error
- [ ] Check Worker logs: `wrangler tail`
- [ ] Verify database connection string
- [ ] Check SQL query syntax
- [ ] Verify Hyperdrive configuration

### Recipes Not Displaying
- [ ] Check API response in Network tab
- [ ] Verify data format matches component expectations
- [ ] Check for JavaScript errors in console
- [ ] Verify authentication is working

## Getting Help from Antigravity

### Effective Prompts

**Good Prompts:**
- "Why is the login failing with error: [paste error]?"
- "Add error handling to the recipe update function"
- "Explain the authentication flow in this application"
- "Find all places where we query the database"

**Less Effective Prompts:**
- "Fix it" (too vague)
- "Make it work" (no context)

### Debugging Workflow with Antigravity

```mermaid
flowchart TD
    A[Encounter Error] --> B[Copy Error Message]
    B --> C[Ask Antigravity to Explain]
    C --> D[Antigravity Suggests Fix]
    D --> E[Apply Fix]
    E --> F{Fixed?}
    F -->|No| G[Ask for Alternative Solution]
    F -->|Yes| H[Done]
    G --> D
    
    style A fill:#f44336
    style H fill:#4caf50
    style C fill:#2196f3
```

## Performance Debugging

### Frontend Performance

**Check Render Performance:**
```javascript
// Add to component
useEffect(() => {
  console.time('Recipes Render');
  return () => console.timeEnd('Recipes Render');
}, [recipes]);
```

**Using Antigravity:**
- Ask: "Optimize the Recipes component for better performance"

### Worker Performance

**Check in Cloudflare Dashboard:**
- Workers & Pages → recipe-api → Metrics
- View CPU time, requests, errors

**Using Antigravity:**
- Ask: "How can I optimize database queries in the Worker?"

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `conn.query is not a function` | Incorrect Hyperdrive API usage | Use `postgres.js` library |
| `No token provided` | Missing Authorization header | Add Bearer token to request |
| `Email not found in token` | Token verification failed | Check Firebase configuration |
| `CORS policy blocked` | Origin not allowed | Add origin to CORS config |
| `Database connection failed` | Hyperdrive misconfigured | Check connection string |

## Logging Best Practices

### Frontend Logging
```javascript
// Development only
if (process.env.NODE_ENV === 'development') {
  console.log('User state:', user);
}
```

### Worker Logging
```javascript
// Always log errors
console.error('Error:', error.message, error.stack);

// Log important events
console.log('User verified:', email);
```

### Viewing Logs

**Frontend:** Browser console (F12)
**Worker:** `wrangler tail` or Cloudflare Dashboard
