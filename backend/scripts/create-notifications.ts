import { pool } from '../src/config/db.config';

const createNotificationsTable = async () => {
    console.log("Connecting to database to create notifications schema...");
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                recipient_email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Notifications table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating notifications table:", err);
        process.exit(1);
    }
};

createNotificationsTable();
