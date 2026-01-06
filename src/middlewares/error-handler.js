import { logger } from '#lib/logger';

export const errorHandler = (err, req, res, next) => {
    logger.error(err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        ok: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
