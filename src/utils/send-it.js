const fs = require('fs');
const inquirer = require('inquirer');
const s3 = require('../s3');

// const arg = process.argv.slice(2)[0];
const uploadsFolder = 'uploads/';
const folderContents = fs.readdirSync(uploadsFolder);
let targetFolder = process.argv.slice(2)[0];
// const prompt = inquirer.createPromptModule();

const questions = [{
  type: 'list',
  name: 'folderDestination',
  message: 'Where would you like to upload your files to?\n',
  choices: ['test-staging/', 'staging/'],
  // filter(val) {
  //   return val.toLowerCase();
  // },
  // validate(value) {
  //   if (value === 'staging/' || value === 'test-staging/') {
  //     return true;
  //   }
  //   return false && 'Not an available upload desitnation';
  // },
}];

if (!targetFolder) {
  inquirer
    .prompt(questions)
    // .then((userAnswer) => (console.log(userAnswer.folderDestination)))
    .then((userAnswer) => {
      targetFolder = userAnswer.folderDestination;
      s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
} else if (targetFolder === 'test-staging/' || targetFolder === 'staging/') {
  s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
} else {
  console.log(`\nFolder:${targetFolder} does not exist`);
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
