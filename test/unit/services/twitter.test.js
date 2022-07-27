const { createTweet, uploadImage } = require('../../../src/services/twitter');
const axios = require('axios').default;

jest.mock('axios');

afterEach(() => {
  jest.resetAllMocks();
});

describe('uploadImage', () => {
  test('successfully uploads image', async () => {
    // setup mocks
    axios.post.mockResolvedValue({
      data: {
        media_id_string: 'i-am-test-media-id',
      },
    });

    // test
    const result = await uploadImage('123');

    // assert
    expect(result).toBe('i-am-test-media-id');
  });

  test('throws error on invalid encodedImage', async () => {
    // setup mocks
    axios.post.mockResolvedValue({
      data: {
        media_id_string: 'i-am-test-media-id',
      },
    });

    // test + assert
    await expect(uploadImage(null))
      .rejects
      .toThrow('Missing encodedImage');
  });

  test('throws error on bad response', async () => {
    // setup mocks
    axios.post.mockResolvedValue({});

    // test + assert
    await expect(uploadImage('123'))
      .rejects
      .toThrow('Unsuccessful request');
  });
});

describe('createTweet', () => {
  test('successfully creates tweet', async () => {
    // setup mocks
    axios.post.mockResolvedValue({
      data: {
        id: 'i-am-test-tweet-id',
      },
    });

    // test
    const result = await createTweet('123');

    // assert
    expect(result.id).toBe('i-am-test-tweet-id');
  });

  test('throws error on invalid mediaId', async () => {
    // setup mocks
    axios.post.mockResolvedValue({
      data: {
        id: 'i-am-test-tweet-id',
      },
    });

    // test + assert
    await expect(createTweet(null))
      .rejects
      .toThrow('Missing mediaId');
  });

  test('throws error on bad response', async () => {
    // setup mocks
    axios.post.mockResolvedValue({});

    // test + assert
    await expect(createTweet('123'))
      .rejects
      .toThrow('Unsuccessful request');
  });
});
