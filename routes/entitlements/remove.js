const { models: { Entitlement } } = require('../../models');
const errors = require('../../utils/errors.json');

module.exports = {
  method: 'delete',
  path: '/:entitlementId',
  handler: async (ctx) => {
    const { entitlementId } = ctx.request.params;
    const { _id, children, parent } = await Entitlement.findById(entitlementId);
    const hasNoDescendants = !children || children.length === 0;

    ctx.assert(hasNoDescendants, 400, errors.entitlements.hasChildren);

    if (parent) {
      const parentNode = await Entitlement.findById(parent);
      parentNode.children = parentNode.children.filter(child => child.toString() !== _id.toString());
      await parentNode.save();
    }
    await Entitlement.deleteOne({ _id: entitlementId });

    ctx.body = entitlementId;
    ctx.status = 200;
  },
};
