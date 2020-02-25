/* eslint-disable no-useless-return */

const logger = require('../lib/logger');
const { models: { User } } = require('../models');
const makeToken = require('./makeToken');
const makePayload = require('./makePayload');


async function issueJwt(ctx) {
  const { user, refreshToken } = ctx.state;
  if (!refreshToken) {
    return;
  }

  try {
    const sanitizedUser = await User.sanitize(user);

    const payload = await makePayload(user, {});
    const token = await makeToken(payload);
    ctx.body = Object.assign({}, ctx.body, {
      token,
      refreshToken: refreshToken.value,
      refreshTokenExpiresAt: refreshToken.expiresAt,
      user: { ...sanitizedUser },
      // need for entitlements
    });
  } catch (error) {
    logger.error(error);
    ctx.throw(500, 'Failed to issue jwt');
  }
}

module.exports = issueJwt;
