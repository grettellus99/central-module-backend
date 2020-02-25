const _ = require('lodash');

const { models: { User } } = require('../models');

async function makePayload(user, configurations) {
  const serializedUser = await User.sanitize(user);

  const payload = {
    user: _.pick(serializedUser, 'smAccountName', 'name', '_id'),
    userId: serializedUser._id,
    iatms: Date.now(),
    configurations,
  };

  // add memberships to payload

  return payload;
}

module.exports = makePayload;
