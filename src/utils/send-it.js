const fs = require('fs');
const inquirer = require('inquirer');
const s3 = require('../s3');

const uploadsFolder = 'uploads/';
const folderContents = fs.readdirSync(uploadsFolder);
let targetFolder = process.argv.slice(2)[0];

const questions = [{
  type: 'list',
  name: 'folderDestination',
  message: 'Where would you like to upload your files to?\n',
  choices: ['test-staging/', 'staging/'],
}];

if (!targetFolder) {
  inquirer
    .prompt(questions)
    .then((userAnswer) => {
      targetFolder = userAnswer.folderDestination;
      s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log('Prompt could not be rendered in the current environment');
        console.log(error);
      } else {
        console.log(error);
      }
    });
} else if (targetFolder === 'test-staging/' || targetFolder === 'staging/') {
  s3.uploadFolderContents(folderContents, uploadsFolder, targetFolder);
} else {
  console.log(`\nFolder:'${targetFolder}' does not exist`);
}
