import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from '#lib/logger';
import { notFoundHandler } from '#middlewares/not-found';
import { errorHandler } from '#middlewares/error-handler';
import authRoutes from '#routes/auth.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Http logger
app.use(pinoHttp({ logger }));

// Routes
app.use('/auth', authRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
