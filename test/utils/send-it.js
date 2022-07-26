const fs = require('fs');
const inquirer = require('inquirer'); // ESLint mad. code still runs
const s3 = require('../../src/s3');

const uploadsFolder = 'uploads/';
const targetFolderArg = process.argv.slice(2)[0];

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

const uploadUniqueFilesToS3 = async (bucketFolder, localRawFileNames, targetFolder) => {
  const existingRawFileNames = await s3.listRawFileNames(bucketFolder);
  const uniqueLocalRawFileNames = deduplicate(localRawFileNames, existingRawFileNames);
  await s3.uploadFolderContents(uniqueLocalRawFileNames, uploadsFolder, targetFolder);
};

const main = async () => {
  const localRawFileNames = fs.readdirSync(uploadsFolder);
  console.log(`Total number of files found from local folder [${uploadsFolder}]: ${localRawFileNames.length}`);

  if (!targetFolderArg) {
    await inquirer
      .prompt(questions)
      .then(async (userAnswer) => {
        const targetFolderAnswer = userAnswer.folderDestination;
        if (targetFolderAnswer === 'test-staging/') {
          await uploadUniqueFilesToS3(testBucketFolders, localRawFileNames, targetFolderAnswer);
        } else if (targetFolderAnswer === 'staging/') {
          await uploadUniqueFilesToS3(liveBucketFolders, localRawFileNames, targetFolderAnswer);
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
  } else if (targetFolderArg === 'test-staging/') {
    uploadUniqueFilesToS3(testBucketFolders, localRawFileNames, targetFolderArg);
  } else if (targetFolderArg === 'staging/') {
    uploadUniqueFilesToS3(liveBucketFolders, localRawFileNames, targetFolderArg);
  } else {
    console.log(`\nFolder:'${targetFolderArg}' does not exist`);
  }
};

main()
  .then(() => console.log('Done uploading files!'))
  .catch((e) => console.error('Error while uploading files', e));
