const s3 = require('./s3');
const twitter = require('./twitter');

const {
  // Feature flags for local development.
  // Note: Lambdas store config values as strings, which is why
  //   booleans are not used here
  STAGING_FOLDER = 'staging/',
  TWEETED_FOLDER = 'tweeted/',
  QUARANTINE_FOLDER = 'quarantine/',
  IS_TWEETING_ENABLED = 'true',
  IS_S3_POST_PROCESSING_ENABLED = 'true',
} = process.env;

const isTweetingEnabled = () => (IS_TWEETING_ENABLED === 'true');
const isS3PostProcessingEnabled = () => (IS_S3_POST_PROCESSING_ENABLED === 'true');

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const handler = async (event) => {
  const objects = await s3.listObjects(STAGING_FOLDER);
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
    if (isTweetingEnabled()) {
      const mediaId = await twitter.uploadImage(encodedImage);
      await twitter.createTweet(mediaId);
    } else {
      console.log('Skip tweeting -- IS_TWEETING_ENABLED:', IS_TWEETING_ENABLED);
    }
  } catch (e) {
    const { response = {} } = e;
    const { data } = response;
    console.error('Twitter error details:', data);
    await s3.moveObject(key, STAGING_FOLDER, QUARANTINE_FOLDER);
    throw e;
  }

  if (isS3PostProcessingEnabled()) {
    console.log('Attempt to move object to \'tweeted\' folder -- key:', key);
    await s3.moveObject(key, STAGING_FOLDER, TWEETED_FOLDER);
  } else {
    console.log(
      'Skip s3 post processing -- IS_S3_POST_PROCESSING_ENABLED:',
      IS_S3_POST_PROCESSING_ENABLED,
    );
  }

  console.log('Done!');
  return event;
};

module.exports = {
  handler,
};
