// TODO improve logger
/* eslint-disable no-console */
const info = (message) => {
  console.log(`Info: ${message}`);
};

const error = (message) => {
  console.log(`Error: ${message}`);
};

module.exports = {
  info,
  error,
};
