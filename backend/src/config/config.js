/*
|--------------------------------------------------------------------------
| ENVIRONMENT CONFIGURATION
|--------------------------------------------------------------------------
|
| Loads environment variables from .env, validates critical secrets and
| connection strings, and exports a single normalized config object for
| use across the application.
|
*/

import dotenv from 'dotenv';

dotenv.config();

const {
    PORT,
    NODE_ENV,
    LOG_LEVEL,

    MONGO_URI,
    REDIS_URL,
    POSTGRE_URI,

    MAX_FAILED_ATTEMPTS,
    LOCK_DURATION,

    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,

    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,

    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} = process.env;

/*
|--------------------------------------------------------------------------
| FAIL-FAST VALIDATION
|--------------------------------------------------------------------------
|
| The application should not boot with missing critical variables.
| This prevents silent misconfiguration in production.
|
*/
const requiredEnvVars = {
    MONGO_URI,
    REDIS_URL,
    POSTGRE_URI,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
};

const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

if (missingEnvVars.length > 0) {
    throw new Error(
        `FATAL: Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
}

/*
|--------------------------------------------------------------------------
| NORMALIZED CONFIG OBJECT
|--------------------------------------------------------------------------
*/
const config = {
    port: Number(PORT) || 5000,
    node_env: NODE_ENV || 'development',
    log_level: LOG_LEVEL || 'info',

    mongo_uri: MONGO_URI,
    redis_uri: REDIS_URL,
    postgre_uri: POSTGRE_URI,

    max_failed_attempts: Number(MAX_FAILED_ATTEMPTS) || 5,
    lock_duration: Number(LOCK_DURATION) || 15 * 60 * 1000,

    jwt_access_secret: JWT_ACCESS_SECRET,
    jwt_refresh_secret: JWT_REFRESH_SECRET,
    jwt_access_expires_in: JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: JWT_REFRESH_EXPIRES_IN,

    google_client_id: GOOGLE_CLIENT_ID,
    google_client_secret: GOOGLE_CLIENT_SECRET,
    google_callback_url: GOOGLE_CALLBACK_URL,

    cloudinary_cloud_name: CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: CLOUDINARY_API_KEY,
    cloudinary_api_secret: CLOUDINARY_API_SECRET
};

export default config;