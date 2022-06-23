const fs = require('fs');
const s3 = require('../s3');

const uploadsFolder = 'uploads/';
const folderContents = fs.readdirSync(uploadsFolder);

s3.uploadFolderContents(folderContents, uploadsFolder);

// resources:
// https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
// https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
