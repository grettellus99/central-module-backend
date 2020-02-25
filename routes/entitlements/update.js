const { Joi } = require('koa-joi-router');
const { models: { Entitlement } } = require('../../models');

module.exports = {
  method: 'put',
  path: '/:entitlementId',
  validate: {
    type: 'json',
    body: Joi.object().keys({
      id: Joi.string(),
      parent: Joi.string(),
      name: Joi.string().required(),
      active: Joi.boolean(),
      order: Joi.number(),
      code: Joi.string().required(),
    }),
  },
  handler: async (ctx) => {
    const { entitlementId } = ctx.request.params;
    const { id, parent, ...rest } = ctx.request.body;

    const entitlement = await Entitlement.findById(entitlementId);

    if (entitlement.parent !== parent) {
      const previewParent = await Entitlement.findById(entitlement.parent);
      if (previewParent) {
        previewParent.children = previewParent.children.filter(child => child.toString() !== id);
        await previewParent.save();
      }
      const newParent = await Entitlement.findById(parent);
      newParent.children = newParent.children ? newParent.children.concat([id]) : [id];
      await newParent.save();
    }

    const updatedEntitlement = Object.assign(entitlement, { id, parent, ...rest });
    await updatedEntitlement.save();

    ctx.body = updatedEntitlement;
    ctx.status = 200;
  },
};
