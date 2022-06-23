const fs = require('fs');
const s3 = require('../s3');

const uploadsFolder = 'uploads/';
const files = fs.readdirSync(uploadsFolder);

s3.uploadFolderContents(files, uploadsFolder);

// resources:
// https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
