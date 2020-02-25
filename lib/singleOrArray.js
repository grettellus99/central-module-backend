const { Joi } = require('koa-joi-router');

const singleOrArray = validator => Joi.alternatives().try([Joi.array().items(validator), validator]);

module.exports = singleOrArray;
