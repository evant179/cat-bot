const axios = require('axios').default;
const { createTweet } = require('./twitter');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();

const handler = async (event) => {
  console.log(event);

  const { status, data } = await axios.get('https://random-data-api.com/api/coffee/random_coffee');
  await createTweet();
  console.log(JSON.stringify(data, null, 2));

  return event;
};

module.exports = {
  handler,
};

// the test!!!!!!!!!!!!!!
