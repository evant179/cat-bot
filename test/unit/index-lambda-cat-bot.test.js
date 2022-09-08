// const { handler, isTweetingEnabled } = require('../../src/index-lambda-cat-bot');
const index = require('../../src/index-lambda-cat-bot');
const s3 = require('../../src/services/s3');
const twitter = require('../../src/services/twitter');
const fakeImages = require('../data/s3-response-list-objects-v2.json').Contents
const uploadImageAPIResponse = require('../data/twitter-response-upload-image.json')

jest.mock('s3');
jest.mock('twitter');
jest.mock('index');

afterEach(() => {
  jest.resetAllMocks();
});

test('this is a placeholder test', () => {
  console.log('hello, i am running this test!!');
  expect(true).toBe(true);
});


test('handler exists', () => {
  expect(index.handler()).toBeDefined()
})

describe('Empty staging folder reaction', () => {
  test('Staging folder gets repopulated if it is empty', async() => {
    // setup mocks
    // mock listObjects so that it returns an empty array

    // const spy = await jest.spyOn(s3, 'listObjects');
    // spy.mockReturnValue([]);

    s3.listObjects = await jest.fn().mockResolvedValue([])
    // s3.listObjects.mockResolvedValue([])

    // test
    // call handler
    // const test = async() => await handler()

    // assert 
    // expect a error message will be returned
    // error msg: `Successfully repopulated ${STAGING_FOLDER} folder with ${TWEETED_FOLDER} contents. Proceed to rerun Lambda.`
    await expect(index.handler()).rejects.toThrow('Successfully repopulated');

    // spy.mockRestore();
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
    // setup mocks
    index.isTweetingEnabled = jest.fn().mockReturnValue(true); 
    s3.getObject = await jest.fn().mockResolvedValue('1');
    s3.listObjects = await jest.fn().mockResolvedValue(fakeImages);
    twitter.uploadImage = await jest.fn().mockResolvedValue(uploadImageAPIResponse)

    // test
    const test = await index.handler();

    // assert
    expect(twitter.uploadImage).toHaveBeenCalled();
  })
})