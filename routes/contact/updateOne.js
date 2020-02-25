const { Joi } = require('koa-joi-router');
const { models: { Contact } } = require('../../models');

module.exports = {
  method: 'patch',
  path: '/:id',
  validate: {
    type: 'json',
    params: {
      id: Joi.objectId(),
    },
  },
  handler: async (ctx) => {
    const { id } = ctx.request.params;
    const { sector, name, extension, smartphone, localphone} = ctx.request.body;

    const contact = await Contact.findById(id);

    ctx.assert(contact, 404, 'Contact not found');

    await Contact.findByIdAndUpdate(id, { sector, name, extension, smartphone, localphone});

    ctx.status = 200;
  },
};
