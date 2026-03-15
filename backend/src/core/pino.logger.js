/*
|--------------------------------------------------------------------------
| STRUCTURED LOGGING LAYER
|--------------------------------------------------------------------------
|
| Provides production-grade JSON logging for:
| - system events
| - audit events
| - access/request events
|
| Sensitive fields are redacted automatically before logs are written.
|
*/

import fs from 'node:fs';
import path from 'node:path';
import pino from 'pino';
import config from '../config/config.js';

const isDevelopment = config.node_env === 'development';
const logLevel = config.log_level || (isDevelopment ? 'debug' : 'info');

const logDirectory = './logs';

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

/*
|--------------------------------------------------------------------------
| ROLLING FILE BLUEPRINT
|--------------------------------------------------------------------------
*/
const bluePrint = (fileLocation, frequency, fileSize, minLevel = 'info') => ({
    target: 'pino-roll',
    level: minLevel,
    options: {
        file: path.join(logDirectory, fileLocation),
        extension: '.json',
        frequency,
        size: fileSize,
        mkdir: true,
        dateFormat: 'yyyy-MM-dd',
        sync: false,
        limit: {
            count: 14
        }
    }
});

/*
|--------------------------------------------------------------------------
| DEV TERMINAL PRETTY PRINT
|--------------------------------------------------------------------------
*/
const terminalTargets = isDevelopment
    ? [
          {
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  ignore: 'pid,hostname',
                  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss'
              }
          }
      ]
    : [];

const systemTransport = pino.transport({
    targets: [
        bluePrint('system/app-info', 'daily', '20m', 'info'),
        bluePrint('errors/app-error', 'daily', '20m', 'error'),
        ...terminalTargets
    ]
});

const auditTransport = pino.transport({
    targets: [bluePrint('audit/app-audit', 'daily', '20m', 'info'), ...terminalTargets]
});

const accessTransport = pino.transport({
    targets: [bluePrint('access/app-access', 'daily', '20m', 'info'), ...terminalTargets]
});

/*
|--------------------------------------------------------------------------
| BASE LOGGER CONFIG
|--------------------------------------------------------------------------
*/
const getBaseConfig = () => ({
    level: logLevel,
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
        paths: [
            'password',
            '*.password',
            'token',
            '*.token',
            'access_token',
            'refresh_token',
            '*.access_token',
            '*.refresh_token',
            'apiKey',
            '*.apiKey',
            'req.headers.authorization',
            'req.headers.cookie'
        ],
        remove: true
    },
    mixin(_context, levelNumber) {
        const labels = {
            10: 'trace',
            20: 'debug',
            30: 'info',
            40: 'warn',
            50: 'error',
            60: 'fatal'
        };

        return {
            level_label: labels[levelNumber] || 'info'
        };
    }
});

export const system_logger = pino(getBaseConfig(), systemTransport);
export const audit_logger = pino(getBaseConfig(), auditTransport);
export const access_logger = pino(getBaseConfig(), accessTransport);

export default {
    system_logger,
    audit_logger,
    access_logger
};