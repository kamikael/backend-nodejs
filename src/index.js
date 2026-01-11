import 'dotenv/config';
import app from './app.js';
import { logger } from '#lib/logger';
import {env} from '#config/env'

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
