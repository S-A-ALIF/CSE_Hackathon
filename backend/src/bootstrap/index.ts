import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { envConfig } from '../config/env.config';
import { pool } from '../config/db.config';
import rootRouter from '../routes';
import { errorHandler } from '../middlewares/errorMiddleware';

const app: Application = express();

// Global Middleware
// CRITICAL: You must allow credentials (cookies/sessions) from your frontend origin
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Adjust to your frontend port
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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