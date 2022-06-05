const fs = require('fs');
const s3 = require('./s3');
const twitter = require('./twitter');

const {
  // feature flags for local development
  IS_POSTING_TWEET = 'true',
} = process.env;

const isPostingTweet = () => (IS_POSTING_TWEET === 'true');

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const handler = async (event) => {
  const objects = await s3.listObjects('staging/');
  if (!objects.length) {
    // TODO - reset folder state:
    //   1. copy all objects from "tweeted" folder to "staging" folder
    //   2. delete all objects in "tweeted" folder
    //   3. call handler again
    throw new Error('No images found in staging folder');
  }

  const { Key: key } = getRandomItem(objects);
  console.log('Attempt to retrieve from s3 -- key:', key);
  const buffer = await s3.getObject(key);
  console.log('Attempt to encode image -- key:', key);
  const encodedImage = buffer.toString('base64');

  try {
    if (isPostingTweet()) {
      const mediaId = await twitter.uploadImage(encodedImage);
      await twitter.createTweet(mediaId);
    } else {
      console.log('Skip tweeting -- IS_POSTING_TWEET:', IS_POSTING_TWEET);
    }
  } catch (e) {
    const { response = {} } = e;
    const { data } = response;
    console.error('Twitter error details:', data);
    throw e;
  }

  return event;
};

module.exports = {
  handler,
};
