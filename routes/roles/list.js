const { models: { Role } } = require('../../models');


module.exports = {
  method: 'get',
  path: '/',
  handler: async (ctx) => {
    ctx.body = await Role.find();
    ctx.status = 200;
  },

};
