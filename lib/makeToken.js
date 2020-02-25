// note:
// jsonwebtoken@5 in koa-jwt@1 module uses unconventional callback
// rely on jsonwebtoken@^6 sign() & verify() for proper node-style callback
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const config = require('config');

const expiresIn = config.get('jwt.accessTokenValiditySeconds');

const { JWT_KEY } = process.env;

function makeToken(payload) {
  const options = {
    expiresIn,
    jwtid: uuid.v4(),
  };
  return new Promise(((resolve, reject) => {
    // sign
    jwt.sign(payload, JWT_KEY, options, (signError, token) => {
      if (signError) {
        reject(signError);
      } else {
        // verify
        jwt.verify(token, JWT_KEY, options, (verifyError) => {
          if (verifyError) {
            reject(verifyError);
          } else {
            resolve(token);
          }
        });
      }
    });
  }));
}

module.exports = makeToken;
