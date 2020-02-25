const mongos = process.env.MONGO_MONGOS
  ? {
    ssl: true,
    sslValidate: true,
    sslCA: process.env.MONGO_SSL_CA,
  }
  : null;

module.exports = {
  app: {
    maxNumberOfDevicesPerUser: 2,
  },
  mongo: {
    uri: 'mongodb://localhost:27017/centralModule',
    connectionOptions: {
      user: process.env.MONGO_USERNAME,
      pass: process.env.MONGO_PASSWORD,
      mongos,
    },
  },
  jwt: {
    debugEnabled: false,
    accessTokenValiditySeconds: Number(process.env.ACCESS_TOKEN_VALIDITY_SECONDS) || 15 * 60 * 60,
    refreshTokenValiditySeconds: Number(process.env.REFRESH_TOKEN_VALIDITY_SECONDS) || 4 * 60 * 60,
  },
};
