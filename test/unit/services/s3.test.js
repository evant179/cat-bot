const { listObjects } = require('../../../src/services/s3');

afterEach(() => {
  jest.resetAllMocks();
});

describe('listObjects', () => {
  test('lists objects from s3 exactly once', async () => {
    const baseResponse = require('../../data/s3-response-list-objects-v2.json');

    // setup mocks
    const listObjectsV2 = jest.fn().mockReturnValue({
      promise: () => Promise.resolve(baseResponse),
    });
    const s3 = {
      listObjectsV2,
    };

    // test
    const result = await listObjects('my-test-folder/', s3);

    // assert
    expect(listObjectsV2).toHaveBeenCalledTimes(1);
    expect(result).toEqual(baseResponse.Contents);
  });
});

// const { retryBatchWriteItem } = require('./utils');

// describe('#retryBatchWriteItem tests', () => {
//   it('should handle empty UnprocessedItems result', async () => {
//     const mockFn = jest.fn().mockResolvedValueOnce({
//       UnprocessedItems: {},
//     });
//     const fnParams = {
//       RequestItems: ['i-am-test-01'],
//     };

//     const result = await retryBatchWriteItem(mockFn, fnParams);

//     expect(mockFn).toHaveBeenCalledTimes(1);
//     expect(mockFn.mock.calls[0][0]).toEqual(fnParams);
//     expect(result).toEqual({
//       UnprocessedItems: {},
//     });
//   });

//   it('should handle non-empty UnprocessedItems result and retry once, then succeed', async () => {
//     const mockFn = jest.fn()
//       .mockResolvedValueOnce({
//         UnprocessedItems: ['retry-me-01'],
//       })
//       .mockResolvedValueOnce({
//         UnprocessedItems: {},
//       });
//     const fnParams = {
//       RequestItems: ['i-am-test-01'],
//     };

//     const result = await retryBatchWriteItem(mockFn, fnParams);

//     expect(mockFn).toHaveBeenCalledTimes(2);
//     expect(mockFn.mock.calls[0][0]).toEqual(fnParams);
//     expect(mockFn.mock.calls[1][0]).toEqual({
//       RequestItems: ['retry-me-01'],
//     });
//     expect(result).toEqual({
//       UnprocessedItems: {},
//     });
//   });

//   it('should exceed maximum retries and throw', async () => {
//     const mockFn = jest.fn()
//       .mockResolvedValueOnce({
//         UnprocessedItems: ['retry-me-01'],
//       })
//       .mockResolvedValueOnce({
//         UnprocessedItems: ['retry-me-02'],
//       });
//     const fnParams = {
//       RequestItems: ['i-am-test-01'],
//     };
//     const maxRetries = 2;

//     expect.assertions(2); // expect error
//     try {
//       await retryBatchWriteItem(mockFn, fnParams, maxRetries);
//     } catch (e) {
//       expect(mockFn).toHaveBeenCalledTimes(2);
//       expect(e).toContain('Maximum retries exceeded');
//     }
//   });
// });