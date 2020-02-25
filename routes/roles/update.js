const { Joi } = require('koa-joi-router');
const { models: { Role } } = require('../../models');
const errors = require('../../utils/errors.json');

module.exports = {
  method: 'put',
  path: '/:roleId',
  validate: {
    type: 'json',
    params: {
      roleId: Joi.objectId(),
    },
    body: Joi.object().keys({
      id: Joi.objectId().required(),
      name: Joi.string(),
      description: Joi.string(),
      active: Joi.boolean(),
      entitlementss: Joi.array().items(Joi.objectId()).required(),
    }),
  },
  handler: async (ctx) => {
    const { roleId } = ctx.request.params;
    const roleData = ctx.request.body;

    const role = await Role.findById(roleId);
    ctx.assert(role, 400, errors.roles.notFound);

    const updatedRole = Object.assign(role, roleData);

    ctx.body = await updatedRole.save();
    ctx.status = 200;
  },

};
