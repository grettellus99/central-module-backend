const { Joi } = require('koa-joi-router');
const { models: { Role } } = require('../../models');

module.exports = {

  method: 'delete',
  path: '/:roleId',
  validate: {
    params: {
      roleId: Joi.objectId(),
    },

  },
  handler: async (ctx) => {
    const { roleId } = ctx.request.params;

    await Role.findByIdAndDelete(roleId);

    ctx.status = 204;
    ctx.body = 'Role deleted successfully';
  },
};
