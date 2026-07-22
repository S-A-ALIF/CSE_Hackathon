import { pool } from '../src/config/db.config';

const createUserInfoTable = async () => {
    console.log("Connecting to database to create user_info schema...");
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_info (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255),
                student_id VARCHAR(255),
                batch_session VARCHAR(255),
                phone_number VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id)
            );
        `);
        console.log("✅ user_info table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating user_info table:", err);
        process.exit(1);
    }
};

createUserInfoTable();
