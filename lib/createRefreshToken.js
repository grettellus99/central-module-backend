const moment = require('moment');
const uuid = require('uuid');
const config = require('config');

const expiresIn = config.get('jwt.refreshTokenValiditySeconds');

function createRefreshToken() {
  return {
    value: uuid.v4(),
    tokenGroup: uuid.v4(),
    expiresAt: moment.utc().add(expiresIn, 'seconds').toDate(),
  };
}

module.exports = createRefreshToken;
