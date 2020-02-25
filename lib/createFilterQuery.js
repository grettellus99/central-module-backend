const map = require('map-obj');
const _ = require('lodash');
const omitUndefined = require('../helpers/omitUndefined');

const transformedOneOrMany = (value, transform) => {
  if (Array.isArray(value)) {
    return value.map(transform);
  }

  return transform(value);
};

function createFilterQuery(filter, fieldsMap, valuesMap) {
  const filterQuery = map(filter, (key, value) => {
    const transformedKey = fieldsMap[key] || key;
    const transformedValue = transformedOneOrMany(value, v => _.get(valuesMap, `${key}.${v}`, v));
    const finalValue = Array.isArray(transformedValue)
      ? { $in: transformedValue }
      : transformedValue;

    return [transformedKey, finalValue];
  });

  return omitUndefined(filterQuery);
}

module.exports = createFilterQuery;
