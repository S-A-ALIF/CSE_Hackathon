import { pool } from '../src/config/db.config';

const initAllTables = async () => {
    console.log("⏳ Connecting to PostgreSQL to initialize all database tables...");
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log("1️⃣ Creating 'users' table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'student',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("2️⃣ Creating 'user_info' table...");
        await client.query(`
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

        console.log("3️⃣ Creating 'teams', 'team_members', and 'team_invitations' tables...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS teams (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                leader_id UUID REFERENCES users(id) ON DELETE CASCADE,
                mentor_id UUID REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS team_members (
                team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (team_id, user_id)
            );

            CREATE TABLE IF NOT EXISTS team_invitations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
                email VARCHAR(255) NOT NULL,
                pin_code VARCHAR(6) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                is_used BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS mentor_invitations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
                mentor_id UUID REFERENCES users(id) ON DELETE CASCADE,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("4️⃣ Creating 'notifications' table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                recipient_email VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT false,
                action_status VARCHAR(20) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_status VARCHAR(20) DEFAULT NULL;
        `);

        console.log("5️⃣ Creating 'platform_settings' table and updating ban columns...");
        await client.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
            ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason TEXT DEFAULT NULL;
            ALTER TABLE teams ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
            ALTER TABLE teams ADD COLUMN IF NOT EXISTS ban_reason TEXT DEFAULT NULL;
            CREATE TABLE IF NOT EXISTS platform_settings (
                key VARCHAR(50) PRIMARY KEY,
                value TEXT NOT NULL
            );
            INSERT INTO platform_settings (key, value) VALUES ('registration_open', 'true') ON CONFLICT (key) DO NOTHING;
        `);

        await client.query('COMMIT');
        console.log("✅ All database tables initialized successfully!");
        process.exit(0);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Error initializing database tables:", err);
        process.exit(1);
    } finally {
        client.release();
    }
};

initAllTables();
