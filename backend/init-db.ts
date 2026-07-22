import { pool } from './src/config/db.config';

const createUsersTable = async () => {
    console.log("Connecting to database to create schema...");
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'student',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Users table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating users table:", err);
        process.exit(1);
    }
};

createUsersTable();
