const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('node:process');
const s3 = require('../s3');

// const arg = process.argv.slice(2)[0];
const uploadsFolder = 'uploads/';
const folderContents = fs.readdirSync(uploadsFolder);
let targetFolder = process.argv.slice(2)[0];
const rl = readline.createInterface({ input, output });

if (!targetFolder) {
  targetFolder = 'test-staging/';
}

const ask = () => new Promise((resolve) => {
  rl.question(`Are you sure you want to upload to Folder:'${targetFolder}'? [Y to confirm]\n`, (userInput) => resolve(userInput));
});

if (targetFolder === 'test-staging/' || targetFolder === 'staging/') {
  ask()
    .then((result) => {
      if (result.toLowerCase().trim() === 'y') {
        s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
        rl.close();
      } else {
        console.log('\nUpload cancelled\nTo upload to the live staging/ folder, type "npm run full-send staging/"');
        rl.close();
      }
    });
} else {
  console.log(`\nFolder:${targetFolder} does not exist`);
  rl.close();
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
