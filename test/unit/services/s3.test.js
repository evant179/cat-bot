const { 
  listObjects, 
  getObject, 
  moveObject,
  moveObjects,
  uploadObject,
} = require('../../../src/services/s3');

afterEach(() => {
  jest.resetAllMocks();
});

describe('listObjects', () => {
  test('lists objects from s3 exactly once', async () => {
    const baseResponse = require('../../data/s3-response-list-objects-v2.json');
    const testFolder = 'my-test-folder/';

    // setup mocks
    const listObjectsV2 = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(baseResponse),
    });
    const s3 = {
      listObjectsV2,
    };

    // test
    const result = await listObjects(testFolder, s3);

    // assert
    expect(listObjectsV2).toHaveBeenCalledTimes(1);
    expect(listObjectsV2).toHaveBeenCalledWith(
      expect.objectContaining({
        Prefix: testFolder,
        StartAfter: testFolder,
        ContinuationToken: undefined,
      }),
    );
    expect(result).toEqual(baseResponse.Contents);
  });

  test('lists objects from s3 with multiple calls using NextContinuationToken / ContinuationToken', async () => {
    const baseResponse = require('../../data/s3-response-list-objects-v2.json');
    const testFolder = 'my-test-folder/';
    const testNextToken = 'my-test-next-token';

    // setup mocks
    const listObjectsV2 = jest.fn()
      .mockReturnValueOnce({
        promise: () => Promise.resolve({
          ...baseResponse,
          NextContinuationToken: testNextToken,
        }),
      })
      .mockReturnValueOnce({
        promise: () => Promise.resolve(baseResponse),
      });
    const s3 = {
      listObjectsV2,
    };

    // test
    const result = await listObjects(testFolder, s3);

    // assert
    expect(listObjectsV2).toHaveBeenCalledTimes(2);
    expect(listObjectsV2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        Prefix: testFolder,
        StartAfter: testFolder,
        ContinuationToken: undefined,
      }),
    );
    expect(listObjectsV2).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        Prefix: testFolder,
        StartAfter: testFolder,
        ContinuationToken: testNextToken,
      }),
    );
    expect(result).toEqual([
      // baseResponse.Contents was returned twice
      ...baseResponse.Contents,
      ...baseResponse.Contents,
    ]);
  });
});

// TODO: test listRawFileNames. this function calls listObjects which makes a call to aws api
// might need to refactor listRawFileNames to allow for mocking a return value for listObjects

describe('getObject', () => {
  test('Returns a buffer', async () => {

  // set up mocks
  const sampleS3Object = {
    Key: 'staging/IMG_20161216_142249.jpg',
    LastModified: '2022-07-27T03:17:56.000Z',
    ETag: '"4727374fff1eb029687319184bc23a10"',
    ChecksumAlgorithm: [],
    Size: 1761676,
    StorageClass: 'STANDARD',
    Body: 'sample buffer',
  }
  const testGetObject = jest.fn().mockReturnValue({
    promise: () => Promise.resolve(sampleS3Object),
  });
  const s3 = {
    getObject: testGetObject,
  };
  const { Key: sampleKey } = sampleS3Object;

  // test
  const getObjectResult = await getObject(sampleKey, s3);

  // asssert
  expect(getObjectResult).toEqual(sampleS3Object.Body)
  });
})

describe('moveObject', () => {
  test('Calls s3.copyObject', async () => {

    // set up mocks
    const deleteObject = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });
    const copyObject = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const s3 = {
      copyObject,
      deleteObject,
    }

    //test
    const result = await moveObject('test-origin-folder/test-s3-object.png', 'test-origin-folder/', 'test-destination-folder/', s3)
    
    // assert
    expect(copyObject).toHaveBeenCalled();
  });

  test('Calls s3.deleteObject', async () => {

    // set up mocks
    const deleteObject = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });
    const copyObject = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const s3 = {
      copyObject,
      deleteObject,
    }

    //test
    const result = await moveObject('test-origin-folder/test-s3-object.png', 'test-origin-folder/', 'test-destination-folder/', s3)

    // assert
    expect(deleteObject).toHaveBeenCalled();
  });
})

describe('moveObjects', () => {
  test('Calls moveObject on every item in an array', async () => {
    const testArray = [
      {
        Key: 'staging/IMG_20161216_142249.jpg',
        LastModified: '2022-07-27T03:17:56.000Z',
        ETag: '"4727374fff1eb029687319184bc23a10"',
        ChecksumAlgorithm: [],
        Size: 1761676,
        StorageClass: 'STANDARD',
        Body: 'sample buffer',
      },
      {
        Key: 'staging/IMG_20161216_142249.jpg',
        LastModified: '2022-07-27T03:17:56.000Z',
        ETag: '"4727374fff1eb029687319184bc23a10"',
        ChecksumAlgorithm: [],
        Size: 1761676,
        StorageClass: 'STANDARD',
        Body: 'sample buffer',
      }
    ]

    // set up mocks
    const deleteObject = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });
    const copyObject = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const s3 = {
      copyObject,
      deleteObject,
    }

    //test
    const result = await moveObjects(testArray, 'test-origin-folder/', 'test-destination-folder/', s3)

    // assert
    expect(copyObject).toHaveBeenCalledTimes(2);
    expect(deleteObject).toHaveBeenCalledTimes(2);
  })
})
// WIP ////////////////////////////////////////////////////////////////
describe('uploadObject', () => {
  test('Sets up proper params for uploading to s3 bucket', async () => {
    
    // set up mocks

    //test

    // assert

  })
})
