const { Joi} = require('koa-joi-router');
const localStorage = require('localStorage');

module.exports = {
    method:'get',
    path: '/nationalInfo',
    handler: async (ctx) => {
        
        const {userCount, connectionCount, bytes, seconds} = JSON.parse(localStorage.getItem('usersNationalInfo'));
        const usersInfo = {
            userCount,
            connectionCount,
            bytes: parseInt(bytes),
            seconds: parseInt(seconds),             
        }
        ctx.body = usersInfo;
        ctx.status = 200;
    },
}