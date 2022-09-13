const index = require('../../src/index-lambda-cat-bot');
const s3 = require('../../src/services/s3');
const twitter = require('../../src/services/twitter');
const fakeImages = require('../data/s3-response-list-objects-v2.json').Contents;
const uploadImageAPIResponse = require('../data/twitter-response-upload-image.json');

jest.mock('s3');
jest.mock('twitter');

afterEach(() => {
  jest.resetAllMocks();
});

describe('handler', () => {
  
  test('twitter.uploadImage and twitter.createTweet are called if isTweetingEnabled is true', async () => {
    // setup mocks so that images are detected in the staging folder
    index.isTweetingEnabled = jest.fn().mockReturnValue(true);
    s3.getObject = await jest.fn().mockResolvedValue('1');
    s3.listObjects = await jest.fn().mockResolvedValue(fakeImages);
    twitter.uploadImage = await jest.fn().mockResolvedValue(uploadImageAPIResponse)
    
    // test
    const test = await index.handler();
    
    // assert
    expect.assertions(4)
    expect(twitter.uploadImage).toHaveBeenCalled();
    expect(twitter.uploadImage).toHaveBeenCalledWith(expect.stringContaining(''));
    expect(twitter.createTweet).toHaveBeenCalled();
    expect(twitter.createTweet).toHaveBeenCalledWith(expect.objectContaining({ media_id: 1533168952922108000 }));
  })
  
  test('Staging folder gets repopulated if it is empty', async () => {
    // setup mocks
    // mock empty staging folder
    s3.listObjects = await jest.fn().mockResolvedValue([]);

    // test and assert
    expect.assertions(1)
    await expect(index.handler).rejects.toThrow('Successfully repopulated');

  })
  
  test('Error from twitter calls handled', async () => {
    // mock twitter API error
    twitter.createTweet = jest.fn().mockRejectedValue(new Error('Twitter API is borked'));

    // setup mocks so that images are detected in the staging folder
    index.isTweetingEnabled = jest.fn().mockReturnValue(true);
    s3.getObject = await jest.fn().mockResolvedValue('1');
    s3.listObjects = await jest.fn().mockResolvedValue(fakeImages);
    twitter.uploadImage = await jest.fn().mockResolvedValue(uploadImageAPIResponse);
    console.error = jest.fn();

    // test and assert
    expect.assertions(2);
    await expect(index.handler).rejects.toThrow();
    expect(console.error).toHaveBeenCalledWith('Twitter error details:', {});
  })
})