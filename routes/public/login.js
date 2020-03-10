const { Joi } = require('koa-joi-router');

const issueJWT = require('../../lib/issueJWT');
const { models: { User } } = require('../../models');
const ldapAuth = require('../../services/ldap');
const createRefreshToken = require('../../lib/createRefreshToken');

function parseResponse(dn) {
  const props = dn.split(',');
  return props.map((element) => {
    const aux = element.split('=');
    return aux[1].toLowerCase();
  });
}

const loginHandler = async (ctx, next) => {
  const { smAccountName, password } = ctx.request.body;
   const { data } = await ldapAuth(smAccountName, password);

  ctx.assert(data.code === 200, 'Invalid Credentials');

  let user = await User.findOne({ smAccountName }).populate('roles').populate('entitlements');

  if (!user) {
    const aux = parseResponse(data.dn);
    const isEstudent = aux.some(
      element => element === 'estudiantes',
    );
    const emailSuffix = isEstudent ? 'est.umcc.cu' : 'umcc.cu';
    const email = `${smAccountName}@${emailSuffix}`;
    user = new User({
      smAccountName,
      email,
      account: {
        status: 'pending',
      },
    });
  }

  const refreshToken = createRefreshToken();
  user.addRefreshToken(refreshToken);

  await user.save();

  ctx.state.user = user;
  ctx.state.refreshToken = refreshToken;

  await next();
  ctx.status = 200;
};

module.exports = {
  method: 'post',
  path: '/login',
  validate: {
    type: 'json',
    body: {
      smAccountName: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
  handler: [loginHandler, issueJWT],
};
