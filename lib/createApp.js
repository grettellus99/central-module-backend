const Koa = require('koa');
const cors = require('@koa/cors');
const jwt = require('koa-jwt');
const MongooseError = require('mongoose/lib/error');
// const _ = require('lodash');
const bodyParser = require('koa-bodyparser');
const koaLogger = require('koa-logger');
const getUsersInfo = require('../services/sqstat');
const getUsersNationalInfo = require('../services/national');

const logger = require('./logger');
const db = require('./db');
const routes = require('../routes');

const { JWT_KEY } = process.env;

async function createApp() {
  try {
    const app = new Koa();


    app.use(async (ctx, next) => {
      if (!['post', 'put', 'patch'].includes(ctx.method.toLowerCase())) {
        ctx.disableBodyParser = true;
      }
      await next();
    });
    app.use(bodyParser());

    // allow cors
    app.use(cors({
      origin: '*',
      allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
      exposeHeaders: ['X-Total-Count', 'Link', 'ETag'],
    }));

    // error middleware
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        if (
          err instanceof MongooseError.ValidationError ||
          (err instanceof MongooseError && err.name === 'StrictModeError')
        ) {
          ctx.throw(400, err);
          return;
        }
        ctx.status = err.status || 500;
        if (ctx.status === 500) {
          logger.error(err);
          ctx.body = '';
        } else {
          ctx.body = err.body || err.message;
        }
        ctx.app.emit('error', err, this);
      }
    });

    setInterval(getUsersInfo, 2000);
    setInterval(getUsersNationalInfo, 2000);



    // check entitlements

    await db.waitOnConnection;

    app.use(koaLogger());
    app.use(routes.pub.middleware());
    app.use(routes.contacts.middleware());

    // enforcing jwt token usage
    //app.use(jwt({ secret: JWT_KEY, key: 'jwt', debug: config.get('jwt.debugEnabled') }));

    // private routes
    app.use(routes.users.middleware());
    app.use(routes.entitlements.middleware());
    app.use(routes.roles.middleware());

    return app;
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = createApp;
