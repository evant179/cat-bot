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

const data = {
  'text': `test!!! ${Date.now()}`
};

const endpointURL = `https://api.twitter.com/2/tweets`;

const oauth = OAuth({
  consumer: {
    key: TWITTER_CONSUMER_KEY,
    secret: TWITTER_CONSUMER_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

async function getRequest({
  oauth_token,
  oauth_token_secret
}) {

  const token = {
    key: oauth_token,
    secret: oauth_token_secret
  };

  const authHeader = oauth.toHeader(oauth.authorize({
    url: endpointURL,
    method: 'POST'
  }, token));

  const req = await axios.post(endpointURL, data, {
    headers: {
      Authorization: authHeader["Authorization"],
      'user-agent': "v2CreateTweetJS",
      'content-type': "application/json",
      'accept': "application/json"
    }
  });
  if (req.data) {
    return req.data;
  } else {
    throw new Error('Unsuccessful request');
  }
}


(async () => {
  try {
    const response = await getRequest({
      oauth_token: TWITTER_CLIENT_ID,
      oauth_token_secret: TWITTER_CLIENT_SECRET,
    });
    console.dir(response, {
      depth: null
    });
  } catch (e) {
    console.log(e);
    process.exit(-1);
  }
  process.exit();
})();
