import { Pool, PoolConfig } from 'pg';
import { envConfig } from './env.config';

/**
 * Robust Pool Configuration Matrix
 * Consumes safely parsed and validated environment schemas directly from envConfig.
 */
const poolConfig: PoolConfig = {
    host: envConfig.db.host,
    port: envConfig.db.port,
    user: envConfig.db.user,
    password: envConfig.db.pass,
    database: envConfig.db.name,
    
    // Performance & Resource Tuning for Production Environments & Neon Serverless
    max: 20,                          // Maximum number of active clients allowed in the pool
    idleTimeoutMillis: 15000,         // Close idle clients after 15 seconds before Neon drops TCP connection
    connectionTimeoutMillis: 30000,   // 30 seconds to allow Neon Serverless DB to wake up from cold sleep
    maxUses: 7500,                    // Recreate allocations after 7500 queries to mitigate memory leaks
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    
    // Explicitly enforce SSL when running in a production ecosystem or using Neon
    ssl: (envConfig.env === 'production' || envConfig.db.host.includes('.neon.tech')) ? { rejectUnauthorized: false } : false
};

/**
 * The unified PostgreSQL Connection Pool Instance.
 * Shared globally across application layers to handle parallel querying efficiently.
 */
export const pool = new Pool(poolConfig);

/**
 * Operational Event Listeners
 * Vital for DevOps observability, telemetry, and handling unexpected connection drops gracefully.
 */
pool.on('connect', () => {
    // Log message only fires when a brand-new client allocation is instantiated inside the pool
    if (envConfig.env === 'development') {
        console.log('📦 Database Infrastructure: New client connection added to the pool.');
    }
});

pool.on('error', (error: Error) => {
    console.error('❌ CRITICAL DATABASE POOL ERROR: Unexpected client failure detected.', {
        message: error.message,
        stack: error.stack
    });
});

/**
 * Graceful Shutdown Utility
 * Ensures all pool connections drain cleanly during unexpected server restarts or SIGTERM signals.
 */
export const closeDatabaseConnection = async (): Promise<void> => {
    console.log('⏳ Database Infrastructure: Draining connection pool safely...');
    try {
        await pool.end();
        console.log('✅ Database Infrastructure: Connection pool closed cleanly.');
    } catch (error) {
        console.error('❌ Error occurred while breaking down database connection pool:', error);
        throw error;
    }
};