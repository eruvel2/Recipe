const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const { verifyToken, verifyAuthenticatedUser } = require('./authMiddleware');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Debug DB Connection
db.query('SELECT current_database()')
    .then(res => console.log('CONNECTED TO DATABASE:', res.rows[0].current_database))
    .catch(err => console.error('DB CONNECTION ERROR:', err));

// Verify user exists in the database
app.post('/api/verify-user', verifyToken, async (req, res) => {
    try {
        // Get email from the verified Firebase token
        const email = req.user?.email;

        if (!email) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Email not found in token'
            });
        }

        // Check if user exists in the users table
        const result = await db.query('SELECT email, updateable FROM users WHERE email = $1', [email.toLowerCase().trim()]);

        if (result.rows.length === 0) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'You do not have permission to access this application.'
            });
        }

        const user = result.rows[0];
        res.json({
            success: true,
            user: {
                email: user.email,
                canUpdate: user.updateable
            }
        });
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});

// Recipe List Endpoint
app.get('/api/recipes', verifyAuthenticatedUser, async (req, res) => {
    try {
        const result = await db.query('SELECT "ID" as id, name, category FROM recipe ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Recipe Endpoint
app.get('/api/recipes/:name', verifyAuthenticatedUser, async (req, res) => {
    const { name } = req.params;

    try {
        const result = await db.query('SELECT * FROM recipe WHERE name = $1', [name]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Update Recipe Endpoint
app.put('/api/recipes/:name', verifyAuthenticatedUser, async (req, res) => {
    const { name: oldName } = req.params;
    console.log('Update Request - Params:', req.params);
    console.log('Update Request - Body:', req.body);
    const { name, category, temperature, cookTime, ingredients } = req.body;

    try {
        // Construct the query dynamically or just hardcode the 25 ingredients
        // Using an array for values
        const values = [name, category, temperature, cookTime || ''];

        let ingredientColumns = '';
        for (let i = 0; i < 25; i++) {
            ingredientColumns += `, ingredient${i + 1} = $${i + 5}`;
            // ingredients from body is an array, get value or empty string
            values.push(ingredients[i] || '');
        }

        // Add the target oldName (or we could use ID if passed) as the last parameter
        values.push(oldName);
        const nameParamIndex = values.length;

        const query = `
            UPDATE recipe 
            SET name = $1, category = $2, temperature = $3, cooktime = $4${ingredientColumns}
            WHERE name = $${nameParamIndex}
            RETURNING *
        `;

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Serve static files from React build directory
// This is placed AFTER API routes so API routes take precedence
app.use(express.static(path.join(__dirname, '../ui/build')));

// For any route not caught by API or static files, serve index.html (client-side routing)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
