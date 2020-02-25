const mongoose = require('mongoose');
const config = require('config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const { ObjectId } = mongoose.Schema.Types;
const { USER_DEVICES_MAX } = process.env;


const MAX_NUMBER_OF_DEVICES_PER_USER = config.app.maxNumberOfDevicesPerUser;
const schemaOptions = {
  strict: false,
};

const refreshTokenSchema = new mongoose.Schema({
  value: { type: String, required: true },
  tokenGroup: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, {
  _id: false,
});

refreshTokenSchema.methods.isActive = function isActive() {
  return this.get('expiresAt') > Date.now();
};

/*
const membershipRoleSchema = new mongoose.Schema({
  id: { type: ObjectId, ref: 'Role' },
  enabled: { type: Boolean, default: true },
});

membershipRoleSchema.virtual('role', {
  ref: 'Role',
  localField: 'id',
  foreignField: '_id',
  justOne: true,
});

 */

const deviceSchema = new mongoose.Schema({

  type: Object,
  required: false,
  name: {
    type: String,
    required: true,
  },
  deviceType: {
    type: Number,
    required: true,
  },

  mac: {
    type: String,
    required: true,
  },
  modifiedDate: {
    type: Date,

  },
  isEnabled: {
    type: Boolean,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  ci: {
    type: String,
  },
  smAccountName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  account: {
    type: Object,
    status: {
      type: String,
      enum: ['enabled', 'disabled', 'pending'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  reset: {
    type: Object,
    required: false,
    token: {
      type: String,
      required: true,
    },
    expiration: {
      type: Number,
      required: true,
    },
  },
  refreshTokens: [refreshTokenSchema],
  roles: [{ type: ObjectId, ref: 'Role' }],
  entitlements: [{ type: ObjectId, ref: 'Entitlement' }],
  devices: [deviceSchema],

}, schemaOptions);


userSchema.pre('save', function preSave(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  const newPassword = user.get('password');

  userSchema.statics.makeHash(newPassword)
    .then((hash) => {
      user.set('password', hash);
      next();
    })
    .catch(next);
});

// ---------
//  METHODS
// ---------

function compareToHash(attempt, hash) {
  return new Promise((resolve, reject) => {
    if (!hash) {
      return resolve(false);
    }
    bcrypt.compare(attempt, hash, (err, success) => {
      if (err) {
        reject(err);
      } else {
        resolve(success);
      }
    });
  });
}


userSchema.methods.comparePassword = function comparePassword(attempt) {
  const hash = this.get('password');
  return compareToHash(attempt, hash);
};

userSchema.methods.compareResetToken = function compareResetToken(attempt) {
  const hash = this.get('reset.token');
  return compareToHash(attempt, hash);
};

userSchema.methods.compareApproveToken = function compareApproveToken(attempt) {
  const hash = this.get('account.approval.token');
  return compareToHash(attempt, hash);
};

userSchema.methods.getRefreshToken = function getRefreshToken(attempt) {
  return (this.get('refreshTokens') || [])
    .find(({ value }) => attempt === value);
};

userSchema.methods.getActiveRefreshTokens = function getActiveRefreshTokens(refreshTokens) {
  const now = Date.now();
  const activeRefreshTokens = (refreshTokens || [])
    .filter(({ expiresAt }) => expiresAt > now);
  if (activeRefreshTokens.length >= MAX_NUMBER_OF_DEVICES_PER_USER) {
    return [];
  }
  return activeRefreshTokens;
};

userSchema.methods.replaceRefreshToken = function replaceRefreshToken(newRefreshToken, oldRefreshTokenValue) {
  const activeRefreshTokens = this.getActiveRefreshTokens(
    this.get(('refreshTokens') || [])
      .filter(({ value }) => oldRefreshTokenValue !== value),
  );
  this.set('refreshTokens', [
    ...activeRefreshTokens,
    newRefreshToken,
  ]);
};

userSchema.methods.addRefreshToken = function addRefreshToken(newRefreshToken) {
  this.set('refreshTokens', [
    ...this.getActiveRefreshTokens(this.get('refreshTokens')),
    newRefreshToken,
  ]);
};

userSchema.methods.getStatus = function getStatus() {
  return _.get(this, 'account.status');
};

userSchema.methods.isPending = function isPending() {
  return this.getStatus() === 'pending';
};

userSchema.methods.isEnabled = function isDisabled() {
  return this.getStatus() === 'enabled';
};

userSchema.methods.isDisabled = function isDisabled() {
  return this.getStatus() === 'disabled';
};

userSchema.methods.enableEntitlements = function addEntitlements(entitlementsIds) {
  this.entitlements = _.union(this.entitlements.map(e => e.toString()), entitlementsIds);
  return this.save();
};

userSchema.methods.normalizeDevices = function normalizeDevices() {
  const { devices } = this;
  if (!devices) {
    return [];
  }
  return devices
    .sort((a, b) => {
      if (!b.isEnabled) {
        return -1;
      }
      if (!a.isEnabled) {
        return 1;
      }
      return b.modifiedDate.getTime() - a.modifiedDate.getTime();
    })
    .slice(0, USER_DEVICES_MAX)
    .filter(item => item.isEnabled)
    .map(item => item.toObject());
};

// ---------
//  STATICS
// ---------

userSchema.static('makeHash', (str) => {
  const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR) || 12;

  return new Promise(((resolve, reject) => {
    // generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (saltErr, salt) => {
      if (saltErr) {
        return reject(saltErr);
      }

      // hash string with salt
      bcrypt.hash(str, salt, (hashErr, hash) => {
        if (hashErr) {
          return reject(hashErr);
        }
        resolve(hash);
      });
    });
  }));
});

userSchema.static('invalidateRefreshToken', async (userId, tokenGroup) => mongoose.model('User').update(
  { _id: userId },
  { $pull: { refreshTokens: { tokenGroup } } },
));

userSchema.static('sanitize', async (userDoc) => {
  const user = userDoc.toObject({ virtuals: true });
  const fieldsToPick = [
    '_id',
    'email',
    'name',
    'account',
    'smAccountName',
    'ci',
    'entitlements',
    'roles',
  ];
  const data = _.pick(user, fieldsToPick);
  // data.status = _.get(user, 'account.status');

  // Set user Roles here

  return {
    ...data,
    devices: userDoc.normalizeDevices(),
  };
});

module.exports = userSchema;
