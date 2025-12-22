// Firebase Admin initialization for Workers
// Note: Workers don't support the full firebase-admin SDK
// We'll verify tokens using Firebase's REST API

export async function verifyFirebaseToken(c, next) {
    const authHeader = c.req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the Firebase ID token using Firebase's public API
        // Get the project ID from the token (it's in the payload)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const projectId = payload.aud;

        // Verify token with Firebase REST API
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${c.env.FIREBASE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken: token })
            }
        );

        if (!response.ok) {
            throw new Error('Invalid token');
        }

        const data = await response.json();

        if (!data.users || data.users.length === 0) {
            throw new Error('User not found');
        }

        const user = data.users[0];

        // Attach user info to context
        c.set('user', {
            uid: user.localId,
            email: user.email,
            email_verified: user.emailVerified
        });

        await next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return c.json({ error: 'Unauthorized: Invalid token' }, 401);
    }
}

export async function verifyUserInDB(c, next) {
    try {
        const user = c.get('user');
        const email = user?.email;

        if (!email) {
            return c.json({
                error: 'Unauthorized',
                message: 'Email not found in token'
            }, 401);
        }

        // Import query function
        const { query } = await import('./db.js');

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

        // Attach DB user info to context
        c.set('dbUser', {
            email: result.rows[0].email,
            canUpdate: result.rows[0].updateable
        });

        await next();
    } catch (error) {
        console.error('Error verifying user in database:', error);
        return c.json({
            error: 'Internal server error',
            details: error.message
        }, 500);
    }
}
