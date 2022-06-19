// access AWS console
// navigate to S3 bucket
// select images to upload
// confirm images to upload
const fs = require('fs');

const uploadsFolder = 'uploads/';

fs.readdir(uploadsFolder, (err, files) => {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach( file => {
        // Do whatever you want to do with the file
        console.log(file); 
    });
    console.log('Done') // npm run full-send
});

