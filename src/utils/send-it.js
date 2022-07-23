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

const testBucketFolders = [
  'test-staging/',
  'test-tweeted/',
  'test-quarantine/',
];

const liveBucketFolders = [
  'staging/',
  'tweeted/',
  'quarantine/',
];

const deduplicate = (localRawFileNames, existingRawFileNames) => {
  const uniqueRawFileNames = localRawFileNames
    .filter((fileName) => !existingRawFileNames.includes(fileName));

  console.log('After deduplication, number of unique local files: ', uniqueRawFileNames.length);
  return uniqueRawFileNames;
};

const uploadUniqueFilesToS3 = async (bucketFolder, localRawFileNames) => {
  const existingRawFileNames = await s3.listRawFileNames(bucketFolder);
  const uniqueLocalRawFileNames = deduplicate(localRawFileNames, existingRawFileNames);
  s3.uploadFolderContents(uniqueLocalRawFileNames, uploadsFolder, targetFolder);
};

const main = async () => {
  const localRawFileNames = fs.readdirSync(uploadsFolder);
  console.log(`Total number of files found from local folder [${uploadsFolder}]: ${localRawFileNames.length}`);

  if (!targetFolder) {
    await inquirer
      .prompt(questions)
      .then((userAnswer) => {
        targetFolder = userAnswer.folderDestination;
        if (targetFolder === 'test-staging/') {
          uploadUniqueFilesToS3(testBucketFolders, localRawFileNames);
        } else if (targetFolder === 'staging/') {
          uploadUniqueFilesToS3(liveBucketFolders, localRawFileNames);
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
  } else if (targetFolder === 'test-staging/') {
    uploadUniqueFilesToS3(testBucketFolders, localRawFileNames);
  } else if (targetFolder === 'staging/') {
    uploadUniqueFilesToS3(liveBucketFolders, localRawFileNames);
  } else {
    console.log(`\nFolder:'${targetFolder}' does not exist`);
  }
};

main()
  .then(() => console.log(`Done uploading files to: ${targetFolder}`))
  .catch((e) => console.error(`Error while uploading files to: ${targetFolder} `, e));
