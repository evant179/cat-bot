const { handler } = require('../../src/index-lambda-cat-bot');

test('this is a placeholder test', () => {
  console.log('hello, i am running this test!!');
  expect(true).toBe(true);
});


test('handler exists', () => {
  expect(handler()).toBeDefined()
})