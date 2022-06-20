// access AWS console
// navigate to S3 bucket
// select images to upload
// confirm images to upload
const fs = require('fs');
const s3 = require('../s3');

const uploadsFolder = 'uploads/';

fs.readdir(uploadsFolder, (err, files) => {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach( file => {
        // Do whatever you want to do with the file
        console.log(`Uploading file: ${file}`);
        s3.uploadFile('./uploads/' + file);
    });
    console.log('Done') // npm run full-send
});

// s3.uploadFile('./uploads/kirb (copy 1).jpeg') this works

// resources:
// https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5