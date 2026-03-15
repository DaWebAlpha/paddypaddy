/*
|--------------------------------------------------------------------------
| MONGOOSE DATABASE CONNECTION
|--------------------------------------------------------------------------
|
| Establishes the MongoDB connection used by all Mongoose models.
|
*/

import mongoose from 'mongoose';
import config from '../config/config.js';
import { system_logger } from './pino.logger.js';

const MONGO_URI = config.mongo_uri;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        system_logger.info('MongoDB connection established');
    } catch (error) {
        system_logger.fatal({ err: error }, 'MongoDB connection failed');
        throw error;
    }
};

export default connectDB;