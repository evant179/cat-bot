const fs = require('fs');
const s3 = require('../s3');

const {
    STAGING_FOLDER,
    S3_BUCKET_NAME
  } = process.env;

const uploadsFolder = 'uploads/';

fs.readdir(uploadsFolder, (err, files) => {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach( file => {
        const targetDestination = S3_BUCKET_NAME + '/' + STAGING_FOLDER;
        const localFile = './uploads/' + file;
        console.log(`Uploading file: ${file}...`);
        s3.uploadFile(localFile, targetDestination);
    });
});

// s3.uploadFile('./uploads/kirb (copy 1).jpeg') this works

// resources:
// https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5