import { pool } from '../src/config/db.config';

const migrate = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        console.log("Creating admin_messages table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS admin_messages (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(255),
                message TEXT NOT NULL,
                target_type VARCHAR(50),
                severity VARCHAR(20) DEFAULT 'info',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Adding admin_message_id to notifications...");
        await client.query(`
            ALTER TABLE notifications 
            ADD COLUMN IF NOT EXISTS admin_message_id UUID REFERENCES admin_messages(id) ON DELETE CASCADE;
        `);
        await client.query('COMMIT');
        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (e) {
        await client.query('ROLLBACK');
        console.error("Migration failed", e);
        process.exit(1);
    } finally {
        client.release();
    }
};

migrate();
