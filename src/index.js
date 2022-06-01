const fs = require('fs');
const { createTweet, uploadImage } = require('./twitter');
// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();

const handler = async (event) => {
  console.log(event);

  try {
    // TODO - reading local image for now
    const encodedImage = fs.readFileSync('test/data/test-image.png').toString('base64');
    const mediaId = await uploadImage(encodedImage);
    await createTweet(mediaId);
  } catch (e) {
    const { response = {} } = e;
    const { data } = response;
    console.error('Error details:', data);
    throw e;
  }

  return event;
};

module.exports = {
  handler,
};
