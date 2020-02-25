const createApp = require('./createApp');
const logger = require('./logger');

const { PORT } = process.env;

async function main() {
  try {
    const app = await createApp();
    await app.listen(4015);
    logger.info(`app: listening on port 4015`);

    return app;
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

module.exports = main();
