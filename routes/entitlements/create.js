const { Joi } = require('koa-joi-router');
const { models: { Entitlement } } = require('../../models');
const errors = require('../../utils/errors.json');

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    type: 'json',
    body: Joi.object().keys({
      parent: Joi.string(),
      name: Joi.string().required(),
      active: Joi.boolean(),
      order: Joi.number(),
      code: Joi.string().required(),
    }),
  },
  handler: async (ctx) => {
    const { name, parent, ...rest } = ctx.request.body;

    const prevEntitlement = await Entitlement.findOne({ name });
    if (prevEntitlement) {
      ctx.throw(400, errors.entitlements.alreadyExists);
    }

    const entitlement = new Entitlement({ name, parent, ...rest });
    await entitlement.save();

    const parentNode = await Entitlement.findById(parent);
    if (parentNode) {
      parentNode.children = parentNode.children
        ? parentNode.children.concat([entitlement._id])
        : [entitlement._id];
      await parentNode.save();
    }

    ctx.body = entitlement;
    ctx.status = 200;
  },
};
