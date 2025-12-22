const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Force no-verify for self-signed certs
const connectionString = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify')
    : '';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
