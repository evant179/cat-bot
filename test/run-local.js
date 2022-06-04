const { handler } = require('../src/index');

const event = {};

handler(event)
  .then(result => console.log('local run successful!', result))
  .catch(e => console.error('error occured: ', e));
