const fs = require('fs');
const readline = require('readline');
const util = require('util');
const { stdin: input, stdout: output } = require('node:process');
const s3 = require('../s3');

// const arg = process.argv.slice(2)[0];
const uploadsFolder = 'uploads/';
const folderContents = fs.readdirSync(uploadsFolder);
const targetFolder = process.argv.slice(2)[0];
const rl = readline.createInterface({ input, output });

// function ask() {
//   return new Promise(resolve => {
//     rl.question('Enter input: ', input => resolve(input));
//   });
// }

// ask()
//   .then((result) => {
//     console.log(console.log('nothing happened lol'));
//     return ask();
//   });

const question = util.promisify(rl.question); // promisify doesn't work on functions that don't take errors?

question(`Are you sure you want to upload to Folder:'${targetFolder}'? [Y to confirm]\n`)
  .then((userInput) => {
    console.log(`nothing happened lol\nBut here's the result: ${userInput}`);
    rl.close();
  })
  .catch((err) => {
    console.log('Error', err);
    rl.close();
  });

// const ask = () => new Promise((resolve) => {
//   rl.question(`Are you sure you want to upload to Folder:'${targetFolder}'? [Y to confirm]\n`, (input) => resolve(input));
// });

// const confirmOrDeny = () => {
//   if (ask().toLowerCase().trim() === 'y') {
//     s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
//     rl.close();
//   } else {
//     console.log('\nUpload cancelled');
//     rl.close();
//   }
// };

// ask()
//   .then((result) => {
//     console.log(`nothing happened lol\nBut here's the result: ${result}`);
//     rl.close();
//   });

// confirmOrDeny();

// just make an async main()

// if (!targetFolder) {
//   rl.question('Upload to the test-staging/ folder? [Y to confirm]\n', (userAnswer) => {
//     if (userAnswer.toLowerCase().trim() === 'y') {
//       s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
//       rl.close();
//     } else {
//       console.log('\nUpload cancelled\nTo upload to the live staging/ folder, type "npm run full-send staging/"');
//       rl.close();
//     }
//   });
// } else if (targetFolder === 'staging/') {
//   rl.question('WARNING: Uploading to the live staging/ folder.\n[Y to confirm]\n', (userAnswer) => {
//     if (userAnswer.toLowerCase().trim() === 'y') {
//       s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
//       rl.close();
//     } else {
//       console.log('\nUpload cancelled');
//       rl.close();
//     }
//   });
// } else {
//   console.log(`\nFolder:${targetFolder} does not exist`);
//   rl.close();
// }

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
