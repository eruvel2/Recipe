import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { verifyFirebaseToken, verifyUserInDB } from './auth.js';
import { query } from './db.js';

const app = new Hono();

// CORS configuration - allow all Pages deployments and custom domains
const allowedOrigins = [
    'https://cc85b067.recipe-app-17d.pages.dev',
    'https://master.recipe-app-17d.pages.dev',
    'https://recipe-app-17d.pages.dev',
    'https://chertech.org',
    'https://www.chertech.org',
    'http://localhost:3000'
];

app.use('/*', cors({
    origin: (origin) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return '*';
        // Check if origin is in allowed list
        return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'Content-Type'],
    credentials: true,
    maxAge: 86400,
}));

// Health check endpoint
app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Verify user exists in database
app.post('/api/verify-user', verifyFirebaseToken, async (c) => {
    try {
        // Get email from the verified Firebase token
        const email = c.get('user')?.email;

        if (!email) {
            return c.json({
                error: 'Unauthorized',
                message: 'Email not found in token'
            }, 401);
        }

        // Check if user exists in the users table
        const result = await query(c.env.DB,
            'SELECT email, updateable FROM users WHERE email = $1',
            [email.toLowerCase().trim()]
        );

        if (result.rows.length === 0) {
            return c.json({
                error: 'Access denied',
                message: 'You do not have permission to access this application.'
            }, 403);
        }

        const user = result.rows[0];
        return c.json({
            success: true,
            user: {
                email: user.email,
                canUpdate: user.updateable
            }
        });
    } catch (error) {
        console.error('Error verifying user:', error);
        return c.json({
            error: 'Internal server error',
            details: error.message
        }, 500);
    }
});

// Recipe List Endpoint
app.get('/api/recipes', verifyFirebaseToken, verifyUserInDB, async (c) => {
    try {
        const result = await query(c.env.DB,
            'SELECT "ID" as id, name, category FROM recipe ORDER BY name ASC'
        );
        return c.json(result.rows);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return c.json({
            error: 'Internal server error',
            details: error.message
        }, 500);
    }
});

// Get Recipe by Name
app.get('/api/recipes/:name', verifyFirebaseToken, verifyUserInDB, async (c) => {
    const name = c.req.param('name');

    try {
        const result = await query(c.env.DB,
            'SELECT * FROM recipe WHERE name = $1',
            [name]
        );

        if (result.rows.length === 0) {
            return c.json({ error: 'Recipe not found' }, 404);
        }

        return c.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return c.json({
            error: 'Internal server error',
            details: error.message
        }, 500);
    }
});

// Update Recipe
app.put('/api/recipes/:name', verifyFirebaseToken, verifyUserInDB, async (c) => {
    const oldName = c.req.param('name');
    const { name, category, temperature, cookTime, ingredients } = await c.req.json();

    try {
        const values = [name, category, temperature, cookTime || ''];

        let ingredientColumns = '';
        for (let i = 0; i < 25; i++) {
            ingredientColumns += `, ingredient${i + 1} = $${i + 5}`;
            values.push(ingredients[i] || '');
        }

        values.push(oldName);
        const nameParamIndex = values.length;

        const queryText = `
      UPDATE recipe 
      SET name = $1, category = $2, temperature = $3, cooktime = $4${ingredientColumns}
      WHERE name = $${nameParamIndex}
      RETURNING *
    `;

        const result = await query(c.env.DB, queryText, values);

        if (result.rows.length === 0) {
            return c.json({ error: 'Recipe not found' }, 404);
        }

        return c.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating recipe:', error);
        return c.json({
            error: 'Internal server error',
            details: error.message
        }, 500);
    }
});

export default app;
