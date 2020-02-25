const { Joi } = require('koa-joi-router');
const { models: { User } } = require('../../models');

module.exports = {
  method: 'patch',
  path: '/:userId/devices/:deviceId',
  validate: {
    type: 'json',
    params: {
      userId: Joi.objectId(),
      deviceId: Joi.objectId(),
    },
  },
  handler: async (ctx) => {
    const { userId, deviceId } = ctx.request.params;

    const user = await User.findById(userId);

    const editDevice = user.devices.find(d => d.id === deviceId);
    editDevice.isEnabled = false;

    await user.save();

    ctx.status = 200;
    ctx.body = user;
  },
};
