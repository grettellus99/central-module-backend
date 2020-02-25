const { Joi } = require('koa-joi-router');
const { models: { User } } = require('../../models');

module.exports = {
  method: 'post',
  path: '/register',
  validate: {
    type: 'json',
    body: {
      payload: Joi.object().keys({
        email: Joi.string(),
        name: Joi.string(),
        ci: Joi.string().required(),
        phone: Joi.string(),
      }),
    },
  },
  handler: async (ctx) => {
    const { user: { _id } } = ctx.state.jwt;
    let { payload: newUser } = ctx.request.body;

    const oldUser = await User.findOne({ ci: newUser.ci });
    if (oldUser) {
      ctx.throw(400, 'User already exist, CI in use');
    }

    newUser = { ...newUser, account: { status: 'enabled' } };

    const user = await User.findOneAndUpdate({ _id }, { ...newUser }, { new: true });

    ctx.body = await User.sanitize(user);
    ctx.status = 201;
  },
};
