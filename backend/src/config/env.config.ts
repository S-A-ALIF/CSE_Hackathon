import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Initialize dotenv configuration before parsing the schemas
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Define the strict validation schema for environment inputs.
 * Zod coercion handles numeric casting automatically.
 * Default values are restored to ensure seamless local development if variables are omitted.
 */
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(5000),
    
    // Database Configuration Strings
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.coerce.number().default(5432),
    DB_USER: z.string().default('postgres'),
    DB_PASSWORD: z.string().default(''), 
    DB_NAME: z.string().default('tutors_portal'),
});

// Evaluate the system environment variables against the target criteria
const parsedEnv = envSchema.safeParse(process.env);

/**
 * Critical Fail-Fast Enforcement Block
 * If any environment variables fail schema validation (e.g., wrong types) on startup, 
 * kill the process immediately and return a formatted error tree.
 */
if (!parsedEnv.success) {
    console.error('❌ CRITICAL RUNTIME ERROR: Invalid system configuration variables:');
    console.error(JSON.stringify(parsedEnv.error.format(), null, 2));
    process.exit(1);
}

/**
 * Export compiled configuration matrix as a frozen, immutable single-source object.
 * The external `DB_PASSWORD` is mapped to the internal `pass` property here.
 */
export const envConfig = {
    env: parsedEnv.data.NODE_ENV,
    port: parsedEnv.data.PORT,
    db: {
        host: parsedEnv.data.DB_HOST,
        port: parsedEnv.data.DB_PORT,
        user: parsedEnv.data.DB_USER,
        pass: parsedEnv.data.DB_PASSWORD,
        name: parsedEnv.data.DB_NAME,
    }
} as const;

// Export the inferred type definition for downstream interface bindings if needed
export type EnvConfigType = typeof envConfig;