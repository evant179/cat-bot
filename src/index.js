// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();

const handler = async (event) => {
  console.log(event);
  return event;
};

module.exports = {
  handler,
};
