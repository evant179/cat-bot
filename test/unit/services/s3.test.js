test('this is a placeholder test', () => {
  console.log('hello, i am running this test!!');
  expect(true).toBe(true);
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