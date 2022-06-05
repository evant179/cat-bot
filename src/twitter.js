const axios = require('axios').default;
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');

const {
  // credentials for the app
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  // credentials for the user (aka client)
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
} = process.env;

const oauth = OAuth({
  consumer: {
    key: TWITTER_CONSUMER_KEY,
    secret: TWITTER_CONSUMER_SECRET,
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64'),
});

const createAuthHeader = (url) => {
  const token = {
    key: TWITTER_CLIENT_ID,
    secret: TWITTER_CLIENT_SECRET,
  };

  const { Authorization: authHeader } = oauth.toHeader(oauth.authorize({
    url,
    method: 'POST',
  }, token));

  return authHeader;
};

const uploadImage = async (encodedImage) => {
  if (!encodedImage) throw new Error('Missing encodedImage');

  const url = 'https://upload.twitter.com/1.1/media/upload.json';
  const authHeader = createAuthHeader(url);
  const body = {
    media_data: encodedImage,
  };

  /**
   * From: https://developer.twitter.com/en/docs/twitter-api/v1/media/upload-media/api-reference/post-media-upload
   *
   * Ensure the POST is a multipart/form-data request. Either upload the raw
   * binary (media parameter) of the file, or its base64-encoded contents
   * (media_data parameter). Use raw binary when possible, because base64
   * encoding results in larger file sizes
   */
  const response = await axios.post(url, body, {
    headers: {
      Authorization: authHeader,
      'content-type': 'multipart/form-data',
      accept: 'application/json',
    },
  });

  if (!response.data) {
    // TODO - parse useful error message from response
    throw new Error('Unsuccessful request');
  }

  console.log('Successful image upload!', JSON.stringify(response.data, null, 2));
  return response.data.media_id_string;
};

const createTweet = async (mediaId) => {
  if (!mediaId) throw new Error('Missing mediaId');

  const url = 'https://api.twitter.com/2/tweets';
  const authHeader = createAuthHeader(url);
  const body = {
    media: {
      media_ids: [mediaId],
    },
  };

  const response = await axios.post(url, body, {
    headers: {
      Authorization: authHeader,
      'user-agent': 'v2CreateTweetJS',
      'content-type': 'application/json',
      accept: 'application/json',
    },
  });

  if (!response.data) {
    // TODO - parse useful error message from response
    throw new Error('Unsuccessful request');
  }

  console.log('Successful tweet!', JSON.stringify(response.data, null, 2));
  return response.data;
};

module.exports = {
  createTweet,
  uploadImage,
};
