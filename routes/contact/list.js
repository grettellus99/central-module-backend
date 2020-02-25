const { Joi } = require('koa-joi-router');
const { models: { Contact } } = require('../../models');

module.exports = {
  method: 'get',
  path: '/',
  handler: async (ctx) => {
    const contacts = await Contact.find({});

    ctx.status = 200;
    ctx.body = contacts;
  },
};
