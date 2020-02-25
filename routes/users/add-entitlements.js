const { Joi } = require('koa-joi-router');
const { models: { User } } = require('../../models');

const addEntitlementsHandler = async (ctx) => {
  const { userId } = ctx.request.params;
  const { entitlementsIds } = ctx.request.body;

  const user = await User.findById(userId);
  ctx.assert(user, 404, 'User not found');

  await user.enableEntitlements(entitlementsIds);

  ctx.status = 204;
  ctx.body = entitlementsIds  ;
};

module.exports = {
  method: 'post',
  path: '/:userId/entitlements',
  validate: {
    type: 'json',
    params: {
      userId: Joi.objectId(),
    },
    body: {
      entitlementsIds: Joi.array().items(Joi.objectId()).required(),
    },
  },
  handler: [addEntitlementsHandler],
};
