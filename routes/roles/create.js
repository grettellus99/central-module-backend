const { Joi } = require('koa-joi-router');
const { models: { Role } } = require('../../models');
const errors = require('../../utils/errors.json');

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    type: 'json',
    body: Joi.object().keys({
      name: Joi.string(),
      description: Joi.string(),
      active: Joi.boolean(),
      entitlements: Joi.array().items(
        Joi.objectId(),
        Joi.object().keys({
          id: Joi.objectId().required(),
          children: Joi.array().items(Joi.objectId(), Joi.object()),
        }),
      ).required(),
    }),
  },
  handler: async (ctx) => {
    const { name, ...rest } = ctx.request.body;

    const prevRole = await Role.findOne({ name });
    ctx.assert(!prevRole, 400, errors.roles.alreadyExists);

    const role = new Role({
      name,
      ...rest,
    });

    ctx.body = await role.save();
    ctx.status = 200;
  },

};
