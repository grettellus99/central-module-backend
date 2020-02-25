const config = require('config');
const mongoose = require('mongoose');
const logger = require('./logger');

// use native promise
mongoose.Promise = global.Promise;

const connectionOptions = config.get('mongo.connectionOptions');

mongoose.connection.on('error', (err) => {
  if (err) {
    logger.error(err);
  }
});

mongoose.connection.on('open', (err) => {
  if (err) {
    logger.error(err);
  } else {
    logger.info(`connected to ${mongoose.connection.db.s.databaseName}`);
  }
});

const uri = config.get('mongo.uri');

const waitOnConnection = mongoose.connect(uri, connectionOptions);

module.exports = { waitOnConnection };
