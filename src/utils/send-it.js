const fs = require('fs');
const s3 = require('../s3');

const {
  STAGING_FOLDER,
  S3_BUCKET_NAME,
} = process.env;

const uploadsFolder = 'uploads/';

fs.readdir(uploadsFolder, (err, files) => {
  if (err) {
    console.log('Unable to scan directory: ');
    throw err;
  }
  files.forEach((fileName) => {
    // const targetDestination = `${S3_BUCKET_NAME}/${STAGING_FOLDER}`;
    const localFileSource = `${uploadsFolder}${fileName}`;
    console.log(`Found file: ${fileName}...`);
    s3.uploadObject(fileName, localFileSource);
  });
  console.log('Uploading files to s3 bucket...');
});

// resources:
// https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
