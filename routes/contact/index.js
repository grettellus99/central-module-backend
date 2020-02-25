const requireDirectory = require('require-directory');
const _ = require('lodash');

const requireDirectoryOptions = {
  exclude: /^index/,
};

module.exports = _.values(requireDirectory(module, requireDirectoryOptions));
