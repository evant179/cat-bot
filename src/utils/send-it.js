const fs = require('fs');
const s3 = require('../s3');

const uploadsFolder = 'uploads/';
const targetFolder = 'staging/';

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
  const existingRawFileNames = await s3.listRawFileNames([
    'staging/',
    'tweeted/',
    'quarantine/',
    'test-staging/',
    'test-tweeted/',
    'test-quarantine/',
  ]);
  const uniqueLocalRawFileNames = deduplicate(localRawFileNames, existingRawFileNames);

  await s3.uploadFolderContents(uniqueLocalRawFileNames, uploadsFolder, targetFolder);
};

main()
  .then(() => console.log(`Done uploading files to: ${targetFolder}`))
  .catch((e) => console.error(`Error while uploading files to: ${targetFolder} `, e));

// resources:
// https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
