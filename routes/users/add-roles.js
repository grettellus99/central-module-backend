const { Joi } = require('koa-joi-router');
const { models: { Role, User } } = require('../../models');

module.exports = {
  method: 'post',
  path: '/:userId/add-role/:roleId',
  validate: {
    type: 'json',
    params: {
      roleId: Joi.objectId(),
      userId: Joi.objectId(),
    },

  },
  handler: async (ctx) => {
    const { userId, roleId } = ctx.request.params;

    const user = await User.findById(userId);
    ctx.assert(user, 404, 'User not found');

    const role = await Role.findById(roleId);
    ctx.assert(role, 404, 'Role not found');

    user.roles.push(roleId);

    await user.save();

    ctx.status = 200;
    ctx.body = user;
  },


};
