const axios = require('axios');
const config = require('config');

const { UM_API_KEY } = process.env;

async function ldapAuth(smAccountName, password) {
  const { ldapAuthURL } = config.microservices;

  return axios({
    url: ldapAuthURL,
    method: 'post',
    data: {
      user_name: smAccountName,
      password,
    },
    headers: {
      'x-umcc-apikey': UM_API_KEY,
    },
  });
}

module.exports = ldapAuth;
