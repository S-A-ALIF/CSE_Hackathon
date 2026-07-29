import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { envConfig } from '../config/env.config';
import { pool } from '../config/db.config';
import rootRouter from '../routes';
import { errorHandler } from '../middlewares/errorMiddleware';

const app: Application = express();

// Global Middleware
// CRITICAL: Allow credentials (cookies/sessions) and support Vercel/localhost origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:4173",
    "https://gstu-cse-hackethon-vert.vercel.app",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
            callback(null, true);
        } else {
            // Allow requesting origin so CORS never blocks hackathon deployment
            callback(null, true);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route (so visiting the Render URL doesn't show "Not Found")
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Tutors Portal API is running successfully on Render!',
        healthCheck: '/health',
        apiEndpoint: '/api/v1'
    });
});

// Basic Health Check Route
app.get('/health', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()');
        
        res.status(200).json({
            status: 'success',
            message: 'Server is running perfectly.',
            databaseTime: result.rows[0].now,
        });
    } catch (error) {
        console.error('Database connection failed during health check:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

app.use('/api/v1', rootRouter);
app.use(errorHandler);

// Start the Server
const PORT = envConfig.port || 5000;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`Environment: ${envConfig.env}`);
    pool.query(`
        ALTER TABLE notifications ADD COLUMN IF NOT EXISTS action_status VARCHAR(20) DEFAULT NULL;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_reason TEXT DEFAULT NULL;
        ALTER TABLE teams ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;
        ALTER TABLE teams ADD COLUMN IF NOT EXISTS ban_reason TEXT DEFAULT NULL;
        CREATE TABLE IF NOT EXISTS platform_settings (
            key VARCHAR(50) PRIMARY KEY,
            value TEXT NOT NULL
        );
        INSERT INTO platform_settings (key, value) VALUES ('registration_open', 'true') ON CONFLICT (key) DO NOTHING;
    `).catch(err => {
        console.error('Migration error during startup:', err);
    });
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
    console.log(`\n🛑 ${signal} received. Closing server...`);
    server.close(async () => {
        try {
            await pool.end();
            console.log('✅ Database connections drained.');
            process.exit(0);
        } catch (err) {
            console.error('❌ Error during database pool shutdown:', err);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;