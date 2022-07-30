const {deduplicate} = require('../../../test/utils/send-it')

test('Deduplicate function test',() => {
    const filesToUpload = [
        'cat.jpg',
        'blurry_cat.png',
        'new_cat.bmp'
    ]
    const exisistingFiles = [
        'cat.jpg',
        'blurry_cat.png',
        'old_cat.psd'
    ]
    console.log('Files deduplicated!');
    // test
    const deduplicatedList = deduplicate(filesToUpload, exisistingFiles);
    // assert
    expect(deduplicatedList).toContain('new_cat.bmp');
});
// TODO: figure out why why main() is being called from send-it.js
