const { Joi } = require('koa-joi-router');
const { models: { Contact } } = require('../../models');

module.exports = {
  method: 'delete',
  path: '/:id',
  validate: {
    params: {
      id: Joi.objectId(),
    },
  },
  handler: async (ctx) => {
    const { id } = ctx.request.params;
    await Contact.findByIdAndRemove(id);

    ctx.status = 204;

  },
};
