const { Joi } = require('koa-joi-router');
const objectIdFactory = require('joi-objectid');

Joi.objectId = objectIdFactory(Joi);

const router = require('koa-joi-router');

const publicRoutes = require('./public');
const usersRoutes = require('./users');
const entitlementsRoutes = require('./entitlements');
const rolesRoutes = require('./roles');
const contactRoutes = require('./contact');

const pub = router();
pub.prefix('/api/');
pub.route(publicRoutes);

const contacts = router();
contacts.prefix('/api/contacts');
contacts.route(contactRoutes);

const users = router();
users.prefix('/api/users');
users.route(usersRoutes);

const entitlements = router();
entitlements.prefix('/api/entitlements');
entitlements.route(entitlementsRoutes);

const roles = router();
roles.prefix('/api/roles');
roles.route(rolesRoutes);

const routes = {
  pub,
  users,
  entitlements,
  roles,
  contacts,
};

module.exports = routes;
