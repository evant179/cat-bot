const fs = require('fs');
const s3 = require('../s3');

// const arg = process.argv.slice(2)[0];
const uploadsFolder = 'uploads/';
const folderContents = fs.readdirSync(uploadsFolder);
const targetFolder = process.argv.slice(2)[0];

if (targetFolder !== 'test-quarantine/') {
  console.log('script did not take "test-quarantine param"\nExiting program');
} else {
  s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
}

// resources:
// https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5

// const fs = require('fs');
// const args = process.argv.slice(2)[0];

// const folderContent = fs.readdirSync(args);

// console.log(folderContent);

// https://stackoverflow.com/questions/11580961/sending-command-line-arguments-to-npm-script

// syntax for passing arg through npm: npm run <command> [-- <args>]
// example: npm run full-send test-quarantine/ will pass 'test-quarantine/' as an arg
