const { Joi} = require('koa-joi-router');
const localStorage = require('localStorage');

module.exports = {
    method:'get',
    path: '/connectionInfo',
    handler: async (ctx) => {
        
        const internetInfo = JSON.parse(localStorage.getItem('usersInfo'));
        let nationalInfo = JSON.parse(localStorage.getItem('usersNationalInfo'));
      


        const generalInfo = {
            nationalInfo,
            internetInfo,

        }
        ctx.body = generalInfo;
        ctx.status = 200;
    },
}