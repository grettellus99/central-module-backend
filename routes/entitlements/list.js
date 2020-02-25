const { models: { Entitlement } } = require('../../models');

module.exports = {
  method: 'get',
  path: '/',
  handler: async (ctx) => {
    ctx.body = await Entitlement.find();
    ctx.status = 200;
  },
};
