import { pool } from '../src/config/db.config';

const createFeedbackTable = async () => {
    console.log("⏳ Connecting to PostgreSQL to create 'feedback' table...");
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log("🛠️ Creating 'feedback' table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                subject VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                description TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                resolved_at TIMESTAMP DEFAULT NULL
            );
        `);

        await client.query('COMMIT');
        console.log("✅ 'feedback' table created successfully!");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("❌ Error creating table:", error);
    } finally {
        client.release();
        process.exit(0);
    }
};

createFeedbackTable();
