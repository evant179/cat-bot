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

const createAuthHeader = (url) => {
  const oauth = OAuth({
    consumer: {
      key: TWITTER_CONSUMER_KEY,
      secret: TWITTER_CONSUMER_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
  });

  const token = {
    key: TWITTER_CLIENT_ID,
    secret: TWITTER_CLIENT_SECRET,
  };

  return oauth.toHeader(oauth.authorize({
    url,
    method: 'POST'
  }, token));
}

const createBody = () => {
  return {
    'text': `test!!! ${Date.now()}`
  };
};

const createTweet = async () => {
  const url = `https://api.twitter.com/2/tweets`;
  const authHeader = createAuthHeader(url);
  const body = createBody();

  const response = await axios.post(url, body, {
    headers: {
      Authorization: authHeader["Authorization"],
      'user-agent': "v2CreateTweetJS",
      'content-type': "application/json",
      'accept': "application/json"
    }
  });

  if (response.data) {
    console.log('Successful tweet!', JSON.stringify(response.data, null, 2));
    return response.data;
  } else {
    // TODO - parse useful error message from response
    throw new Error('Unsuccessful request');
  }
}

createTweet()
  .then(() => console.log('done running twitter.js'))
  .catch((e) => console.error('an error occured:', e));
