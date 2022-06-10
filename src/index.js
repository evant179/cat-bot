const s3 = require('./s3');
const twitter = require('./twitter');

const {
  // Feature flags for local development.
  // Note: Lambdas store config values as strings, which is why
  //   booleans are not used here
  IS_TWEETING_ENABLED = 'true',
  IS_S3_POST_PROCESSING_ENABLED = 'true',
} = process.env;

const isTweetingEnabled = () => (IS_TWEETING_ENABLED === 'true');
const isS3PostProcessingEnabled = () => (IS_S3_POST_PROCESSING_ENABLED === 'true');

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

  // to test the newly added moveObject 
  // function in the catch block, set the 
  // key const to the key of and image 
  // with a file size of > 5MB and then 
  // comment out line 34
  // try using staging/PXL_20220603_022926496.MP.jpg. 
  // The file size is 11.1MB
  // const { Key: key } = getRandomItem(objects);
  const key = 'staging/PXL_20220603_022926496.MP.jpg';
  console.log('Attempt to retrieve from s3 -- key:', key);
  const buffer = await s3.getObject(key);
  console.log('Attempt to encode image -- key:', key);
  const encodedImage = buffer.toString('base64');

  try {
    if (isTweetingEnabled()) {
      const mediaId = await twitter.uploadImage(encodedImage);
      await twitter.createTweet(mediaId);
      // apply a try/catch to this call of createTweet?
      // creatTweet is already in a try block so if it 
      // thows an error it should be caught in the 
      // following error block
      // if not try a try/catch here?
    } else {
      console.log('Skip tweeting -- IS_TWEETING_ENABLED:', IS_TWEETING_ENABLED);
    }
  } catch (e) {
    await s3.moveObject(key, 'staging/', 'quarantine/');
    const { response = {} } = e;
    const { data } = response;
    console.error('Twitter error details:', data);
    throw e;
  }

  if (isS3PostProcessingEnabled()) {
    console.log('Attempt to move object to \'tweeted\' folder -- key:', key);
    await s3.moveObject(key, 'staging/', 'tweeted/');
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
