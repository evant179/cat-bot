const fs = require('fs');
const inquirer = require('inquirer');
const s3 = require('../s3');

const uploadsFolder = 'uploads/';
let targetFolder = process.argv.slice(2)[0];

const questions = [{
  type: 'list',
  name: 'folderDestination',
  message: 'Where would you like to upload your files to?\n',
  choices: ['test-staging/', 'staging/'],
}];

const deduplicate = (localRawFileNames, existingRawFileNames) => {
  const uniqueRawFileNames = localRawFileNames
    .filter((fileName) => !existingRawFileNames.includes(fileName));

  console.log('After deduplication, number of unique local files: ', uniqueRawFileNames.length);
  return uniqueRawFileNames;
};

const main = async () => {
  const localRawFileNames = fs.readdirSync(uploadsFolder);
  console.log(`Total number of files found from local folder [${uploadsFolder}]: ${localRawFileNames.length}`);

  // TODO - Simply grabbing both the live and test folders for now.
  // There is a WIP feature that will change this to be driven by user input.
  // const existingRawFileNames = await s3.listRawFileNames([
  //   'staging/',
  //   'tweeted/',
  //   'quarantine/',
  //   'test-staging/',
  //   'test-tweeted/',
  //   'test-quarantine/',
  // ]);

  // await s3.uploadFolderContents(uniqueLocalRawFileNames, uploadsFolder, targetFolder);
  if (!targetFolder) {
    inquirer
      .prompt(questions)
      .then((userAnswer) => {
        if (userAnswer === 'test-staging/') {
          const existingRawFileNames = s3.listRawFileNames([
            'test-staging/',
            'test-tweeted/',
            'test-quarantine/',
          ]);
          const uniqueLocalRawFileNames = deduplicate(localRawFileNames, existingRawFileNames);
          targetFolder = userAnswer.folderDestination;
          s3.uploadFolderContents(uniqueLocalRawFileNames, uploadsFolder, targetFolder);
        } else if (userAnswer === 'staging/') {
          const existingRawFileNames = s3.listRawFileNames([
            'staging/',
            'tweeted/',
            'quarantine/',
          ]);
          const uniqueLocalRawFileNames = deduplicate(localRawFileNames, existingRawFileNames);
          targetFolder = userAnswer.folderDestination;
          s3.uploadFolderContents(uniqueLocalRawFileNames, uploadsFolder, targetFolder);
        }
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
    // s3.uploadFolderContents(uniqueLocalRawFileNames, uploadsFolder, targetFolder);
    console.log('This command is currently under construction and does not yet take aruments from CLI');
  } else {
    console.log(`\nFolder:'${targetFolder}' does not exist`);
  }
};

main()
  .then(() => console.log(`Done uploading files to: ${targetFolder}`))
  .catch((e) => console.error(`Error while uploading files to: ${targetFolder} `, e));
