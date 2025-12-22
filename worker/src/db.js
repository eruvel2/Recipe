// Database connection using Hyperdrive with postgres.js
import postgres from 'postgres';

export async function query(hyperdrive, text, params = []) {
    try {
        // Hyperdrive provides a connectionString property
        const sql = postgres(hyperdrive.connectionString, {
            prepare: false,
            // Hyperdrive handles connection pooling
        });

        // Execute the query
        const result = await sql.unsafe(text, params);

        // Close the connection
        await sql.end();

        return {
            rows: result
        };
    } catch (error) {
        console.error('Database query error:', error);
        console.error('Query:', text);
        console.error('Params:', params);
        throw error;
    }
}
