module.exports = {
  jwt: {
    debugEnabled: true,
  },
  mongo: {
    uri: 'mongodb://localhost/um-users',
    sslEnabled: false,
    debug: true,
    connectionOptions: [],
  },
  microservices: {
    ldapAuthURL: 'http://10.34.8.190:3301/ldap/login',
  },
};
