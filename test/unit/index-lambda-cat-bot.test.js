const { handler } = require('../../src/index-lambda-cat-bot');
const s3 = require('../../src/services/s3');

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
    // mock listObjects so that it returns an empty array

    // const spy = await jest.spyOn(s3, 'listObjects');
    // spy.mockReturnValue([]);

    s3.listObjects = await jest.fn().mockReturnValue([])

    // test
    // call handler
    const test = async() => await handler()

    // assert 
    // expect a error message will be returned
    // error msg: `Successfully repopulated ${STAGING_FOLDER} folder with ${TWEETED_FOLDER} contents. Proceed to rerun Lambda.`
    expect(test).toThrow();

    // spy.mockRestore();
  })
})