const { Joi } = require('koa-joi-router');
const singleOrArray = require('../../lib/singleOrArray');
const { models: { User } } = require('../../models');
const createFilterQuery = require('../../lib/createFilterQuery');

const valuesMap = {
  status: {
    active: 'enabled',
    inactive: 'disabled',
    pending: 'pending',
  },
};

module.exports = {
  method: 'get',
  path: '/',
  validate: {
    query: Joi.object().keys({
      fields: singleOrArray(Joi.string()),
      search: Joi.string().default(''),
      skip: Joi.number().integer().min(0).default(0),
      limit: Joi.number().integer().min(0).max(100)
        .default(10),
      sort: Joi.object().default({ smAccountName: 1 }),
      filter: Joi.object({
        status: singleOrArray(['active', 'inactive', 'pending']),
        _id: singleOrArray(Joi.string()),
      }).rename('id', '_id')
        .default(),
    }),
  },
  handler: async (ctx) => {
    const { fields, limit, skip, filter, search } = ctx.request.query;
    let { sort } = ctx.request.query;
    const searchQuery = createFilterQuery(filter, valuesMap);
    const select = {};

    if (search) {
      Object.assign(searchQuery, { $text: { $search: search } });
      select.score = { $meta: 'textScore' };
      sort = { score: { $meta: 'textScore' } };
    }

    const [users, count] = await Promise.all([
      User
        .find(searchQuery, select)
        .limit(Number(limit))
        .skip(Number(skip))
        .sort(sort),
      User
        .find(searchQuery, select)
        .count(),
    ]);

    const usersData = (await Promise.all(users.map(User.sanitize)))
      .map(user => (fields ? _.pick(user, fields) : user));

    ctx.body = {
      users: usersData,
      count,
    };
    ctx.status = 200;
  },
};
