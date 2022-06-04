const fs = require('fs');
const { listObjects } = require('./s3');
const { createTweet, uploadImage } = require('./twitter');

const {
  // feature flags for local development
  IS_POSTING_TWEET = 'true',
} = process.env;

const isPostingTweet = () => (IS_POSTING_TWEET === 'true');

const handler = async (event) => {
  console.log(event);

  try {
    await listObjects();

    // TODO - reading local image for now
    const encodedImage = fs.readFileSync('test/data/test-image.png').toString('base64');

    if (isPostingTweet()) {
      const mediaId = await uploadImage(encodedImage);
      await createTweet(mediaId);
    } else {
      console.log('Skip tweeting -- IS_POSTING_TWEET:', IS_POSTING_TWEET);
    }
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
