const { Joi } = require('koa-joi-router');
const { models: { Role } } = require('../../models');

module.exports = {
  method: 'get',
  path: '/:roleId',
  validate: {
    type: 'json',
    params: {
      roleId: Joi.objectId(),
    },
  },
  handler: async (ctx) => {
    ctx.body = await Role.findById(ctx.params.roleId);
    ctx.status = 200;
  },

};
