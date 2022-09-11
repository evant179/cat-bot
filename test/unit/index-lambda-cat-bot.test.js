const { handler} = require('../../src/index-lambda-cat-bot');
const index = require('../../src/index-lambda-cat-bot');
const s3 = require('../../src/services/s3');
const twitter = require('../../src/services/twitter');
const fakeImages = require('../data/s3-response-list-objects-v2.json').Contents
const uploadImageAPIResponse = require('../data/twitter-response-upload-image.json')

jest.mock('s3');
jest.mock('twitter');

afterEach(() => {
  jest.resetAllMocks();
});

test('this is a placeholder test', () => {
  console.log('hello, i am running this test!!');
  expect(true).toBe(true);
});


test('handler exists', () => {
  expect(handler()).toBeDefined()
})

describe('Empty staging folder reaction', () => {
  test('Staging folder gets repopulated if it is empty', async() => {
    // setup mocks
    // mock empty staging folder
    s3.listObjects = await jest.fn().mockResolvedValue([])

    // test and assert
    await expect(handler()).rejects.toThrow('Successfully repopulated');

  })
})

// TOTEST:
// encodedImage is a buffer
// twitter.uploadImage and twitter.createTweet are called if isTweetingEnabled is true
// twitter.uploadImage is called with encodedImage
// twitter.createTweet is called with object containing "media_id"
// 

describe('Main tweeting function', () => {
  test('twitter.uploadImage and twitter.createTweet are called if isTweetingEnabled is true', async() => {
    // setup mocks so that images are detected in the staging folder
    index.isTweetingEnabled = jest.fn().mockReturnValue(true); 
    s3.getObject = await jest.fn().mockResolvedValue('1');
    s3.listObjects = await jest.fn().mockResolvedValue(fakeImages);
    twitter.uploadImage = await jest.fn().mockResolvedValue(uploadImageAPIResponse)

    // test
    const test = await handler();

    // assert
    expect(twitter.uploadImage).toHaveBeenCalled();
    expect(twitter.createTweet).toHaveBeenCalled();
  })
})