/*
|--------------------------------------------------------------------------
| NOT FOUND MIDDLEWARE
|--------------------------------------------------------------------------
|
| Handles all unmatched routes.
|
*/

import { system_logger } from '../core/pino.logger.js';

export default function notFound(req, res) {
  system_logger.warn(
    {
      path: req.originalUrl,
      method: req.method,
      ip: req.ip
    },
    'Route not found'
  );

  return res.status(404).json({
    success: false,
    title: 'Resource not found',
    message: `The requested URL ${req.originalUrl} was not found on this server`,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
}