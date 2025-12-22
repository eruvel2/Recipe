const admin = require('./firebaseAdmin');
const db = require('./db');

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Middleware to verify user exists in database
const verifyUserInDB = async (req, res, next) => {
    try {
        // Get email from the decoded token (set by verifyToken middleware)
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

        // Attach user info to request for use in route handlers
        req.dbUser = {
            email: result.rows[0].email,
            canUpdate: result.rows[0].updateable
        };

        next();
    } catch (error) {
        console.error('Error verifying user in database:', error);
        return res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

// Combined middleware: verify Firebase token AND database user
const verifyAuthenticatedUser = [verifyToken, verifyUserInDB];

module.exports = {
    verifyToken,
    verifyUserInDB,
    verifyAuthenticatedUser
};
