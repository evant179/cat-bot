const { listObjects } = require('../../../src/services/s3');

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
