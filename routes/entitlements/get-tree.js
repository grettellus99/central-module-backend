const { models: { Entitlement } } = require('../../models');

module.exports = {
  method: 'get',
  path: '/build/tree',
  handler: async (ctx) => {
    const entitlements = await Entitlement.find({ parent: undefined });
    const filledEntitlements = await Promise.all(
      entitlements.map(async item => Entitlement.populateDescendants(
        item,
        id => Entitlement.findById(id),
        Entitlement.populateDescendants,
      )),
    );

    ctx.body = filledEntitlements;
    ctx.status = 200;
  },
};
