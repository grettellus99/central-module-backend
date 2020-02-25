const _ = require('lodash');

const omitUndefined = (object) => {
  const copy = Array.isArray(object) ? [] : {};
  _.map(object, (value, key) => {
    if (typeof value !== 'undefined') {
      if (Array.isArray(object)) {
        copy.push(value);
      } else {
        copy[key] = value;
      }
    }
  });

  return copy;
};

module.exports = omitUndefined;
