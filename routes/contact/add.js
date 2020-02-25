const { Joi } = require('koa-joi-router');
const { models: { Contact } } = require('../../models');

module.exports = {
  method: 'post',
  path: '/',
  /* validate: {
    type: 'json',
    body: {
      sector: Joi.string(),
      level: Joi.string(),
      name: Joi.string(),
      extension: Joi.string(),
      smartphone: Joi.array(),
      homephone: Joi.array(),
      localphone: Joi.array(),
    },
  },
  */
  handler: async (ctx) => {
    const { sector, name, extension, smartphone, localphone } = ctx.request.body;

    const contact = await Contact.findOne({ name });

    ctx.assert(!contact, 409, 'Contact Already Exist');

    const newContact = new Contact({
      sector,
      name,
      extension,
      smartphone,
      localphone,
    });

    await newContact.save();

    ctx.status = 200;
    ctx.body = newContact;



  },
};
