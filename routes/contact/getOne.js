const { Joi } = require('koa-joi-router');
const { models: { Contact } } = require('../../models');

module.exports = {
  method: 'get',
  path: '/:id',
  validate: {
    params: {
      id: Joi.objectId(),
    },
  },
  handler: async (ctx) => {
    const { id } = ctx.request.params;

    const contact = await Contact.findById(id);

    ctx.assert(contact, 404, 'Contact not found');

    ctx.status = 200;
    ctx.body = contact;
  },
};
