const mongoose = require('mongoose');
const _ = require('lodash');

const { ObjectId } = mongoose.Schema.Types;

const entitlementSchema = new mongoose.Schema({
  parent: { type: String },
  name: { type: String, required: true },
  order: { type: String },
  code: { type: String },
  active: { type: String },
  children: [{ type: ObjectId, ref: 'Entitlement' }],
});

entitlementSchema.index(
  {
    name: 1,
  },
  {
    name: 'name_1',
    unique: true,
    sparse: true,
  },
);

entitlementSchema.static('populateDescendants', async (document, findFunction, populateFunction) => {
  const { children, ...rest } = document.toObject();

  let normalizedChilren;
  if (children && children.length > 0) {
    normalizedChilren = await Promise.all(
      children.map(async (item) => {
        const completeChild = await findFunction(item._id);
        return populateFunction(completeChild, findFunction, populateFunction);
      }),
    );
  }
  return {
    ...rest,
    children: normalizedChilren,
  };
});

entitlementSchema.static('sanitize', async (document) => {
  const entitlement = document.toObject({ virtuals: true });
  const fieldsToPick = [
    '_id',
    'name',
    'code',
    'order',
    'active',
    'parent',
  ];
  return _.pick(entitlement, fieldsToPick);
});

module.exports = entitlementSchema;
