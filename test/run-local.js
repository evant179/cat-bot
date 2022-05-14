const { handler } = require('../src/index');

const event = {
  testKey: 'TODO - s3 event object',
};

handler(event)
  .then(result => console.log('local run successful!', result))
  .catch(e => console.error('error occured: ', e));
