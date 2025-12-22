const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;
try {
    // Try to load from file path
    serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} catch (error) {
    // If file not found, try to parse JSON string from env
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (parseError) {
        console.error('Failed to load Firebase credentials:', error.message, parseError.message);
        process.exit(1);
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
