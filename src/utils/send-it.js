const fs = require('fs');
const readline = require('readline');
const s3 = require('../s3');

// const arg = process.argv.slice(2)[0];
const uploadsFolder = 'uploads/';
const folderContents = fs.readdirSync(uploadsFolder);
const targetFolder = process.argv.slice(2)[0];
const rl = readline.createInterface(process.stdin, process.stdout);

if (targetFolder === '') {
  rl.question('Upload to the test-staging/ folder?');
  s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
} else if (targetFolder === 'staging/') {
  rl.question('WARNING: Uploading to the live staging/ folder.\nConfirm? [Y/n]');
  s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
} else {
  console.log(`Folder:${targetFolder} does not exist`);
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
