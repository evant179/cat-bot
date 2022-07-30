const sum = require('../../src/index-lambda-resize')

test('this is a placeholder test', () => {
  console.log('hello, i am running this test!!');
  expect(true).toBe(true);
});

test('SUM FUNCTION TEST', () => {
  console.log('SUM FUNCTION RUN TAKE SUCCESS');
  expect(sum(2,3)).toBe(5);
})
