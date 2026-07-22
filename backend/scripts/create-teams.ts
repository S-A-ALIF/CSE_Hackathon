import { pool } from '../src/config/db.config';

const createTeamsSchema = async () => {
    console.log("Connecting to database to create teams schema...");
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS teams (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                leader_id UUID REFERENCES users(id) ON DELETE CASCADE,
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
        `);
        console.log("✅ Teams schema created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating teams schema:", err);
        process.exit(1);
    }
};

createTeamsSchema();
