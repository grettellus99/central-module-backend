const _ = require('lodash');
const { Joi } = require('koa-joi-router');
const { models: { Role } } = require('../../models');
const errors = require('../../utils/errors.json');

module.exports = {
  method: 'post',
  path: '/:roleId/entitlements',
  validate: {
    type: 'json',
    params: {
      roleId: Joi.objectId(),
    },
    body: {
      entitlementsIds: Joi.array().items(Joi.objectId()).required(),
    },

  },
  handler: async (ctx) => {
    const { roleId } = ctx.request.params;
    const { entitlementsIds } = ctx.request.body;

    const role = await Role.findById(roleId);

    ctx.assert(role, 404, errors.roles.notFound);

    role.entitlements = _.union(role.entitlements, entitlementsIds);

    await role.save();

    ctx.status = 204;
    ctx.body = role;
  },

};
