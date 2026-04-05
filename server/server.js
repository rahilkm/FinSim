const env = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');
const logger = require('./config/logger');

const startServer = async () => {
    await connectDB();

    app.listen(env.PORT, () => {
        logger.info(`FinSim API running on port ${env.PORT} [${env.NODE_ENV}]`);
    });
};

startServer();
