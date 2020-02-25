const { Joi } = require('koa-joi-router');
const { models: { User }, enums: { userEnums: { devicesTypes } } } = require('../../models');

const { USER_DEVICES_MAX } = process.env;


module.exports = {
  method: 'put',
  path: '/:userId/devices',
  validate: {
    type: 'json',
    params: {
      userId: Joi.objectId(),
    },
    body: Joi.object().keys({
      id: Joi.objectId(),
      name: Joi.string().required(),
      deviceType: Joi.number().valid(Object.values(devicesTypes)).required(),
      mac: Joi.string().required(),
      modifiedDate: Joi.date(),
      isEnabled: Joi.boolean(),
    }),
  },
  handler: async (ctx) => {
    const { userId } = ctx.request.params;
    const device = ctx.request.body;

    const user = await User.findById(userId);

    ctx.assert(user, 404, 'User not found');
    const { devices } = user;

    const enabledDev = devices.filter(d => d && d.isEnabled);
    const isUpdatingDevice = devices.some(d => d.mac === device.mac);
    const isReplacing = !!device.id;
    const condition = isUpdatingDevice || isReplacing || enabledDev.length < USER_DEVICES_MAX;

    ctx.assert(condition, 400, 'Max number of enabled devices reached');

    if (isUpdatingDevice) {
      user.devices = devices.map((d) => {
        if (d.mac === device.mac) {
          return device;
        }
        return d;
      });
    } else if (isReplacing) {
      const newDevices = devices.map((d) => {
        if (d._id.toString() === device.id) {
          return {
            ...d.toObject(),
            isEnabled: false,
          };
        }
        return d;
      }).concat([{
        ...device,
        _id: undefined,
        modifiedDate: new Date(),
      }]);
      user.devices = newDevices;
    } else {
      user.devices.push({
        ...device,
        modifiedDate: new Date(),
      });
    }

    await user.save();

    ctx.status = 200;
    ctx.body = await User.sanitize(user);
  },
};
