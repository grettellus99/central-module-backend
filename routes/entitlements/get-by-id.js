const { models: { Entitlement } } = require('../../models');

module.exports = {
  method: 'get',
  path: '/:entitlementId',
  handler: async (ctx) => {
    const { entitlementId } = ctx.request.params;
    ctx.body = await Entitlement.findById(entitlementId);
    ctx.status = 200;
  },
};
