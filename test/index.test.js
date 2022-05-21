test('this is a placeholder test', () => {
  console.log('hello, i am running this test!!');
  expect(true).toBe(true);
});

test('test workflow with failing test', () => {
  console.log('this test will fail');
  expect(true).toBe(false);
});
