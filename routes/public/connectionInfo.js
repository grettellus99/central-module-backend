const { Joi} = require('koa-joi-router');
const localStorage = require('localStorage');

module.exports = {
    method:'get',
    path: '/connectionInfo',
    handler: async (ctx) => {
        
        const userInfo = JSON.parse(localStorage.getItem('usersInfo'));
        let nationalInfo = JSON.parse(localStorage.getItem('usersNationalInfo'));
        const internetInfo = {
            userCount: userInfo.userCount - nationalInfo.userCount,
            connectionCount: userInfo.connectionCount - nationalInfo.connectionCount,
            bytes: parseInt(userInfo.bytes) * 1024  - parseInt(nationalInfo.bytes),
            seconds: parseInt(userInfo.seconds - nationalInfo.seconds),

        }
        const {userCount, connectionCount, bytes, seconds} = nationalInfo;
        nationalInfo = Object.assign({}, {userCount, connectionCount, bytes: parseInt(bytes),seconds: parseInt(seconds)});


        const generalInfo = {
            nationalInfo,
            internetInfo,

        }
        ctx.body = generalInfo;
        ctx.status = 200;
    },
}