const resize = require('sharp/lib/resize'); // research sharp library. I forgot how it works
const s3 = require('../s3');

const {
  STAGING_FOLDER = 'staging/',
  TWEETED_FOLDER = 'tweeted/',
  QUARANTINE_FOLDER = 'quarantine/',
} = process.env;

const quarantinedFiles = s3.listObjects(QUARANTINE_FOLDER);

const resizeFiles = async (folderContents) => {
  try {
    folderContents.map(async (file) => {
      await resize(file).promise; // make that file the small file!
    });
  } catch (err) {
    console.log(`Failed to resize all contents of ${QUARANTINE_FOLDER}`, err);
    throw err;
  }
};

resizeFiles(quarantinedFiles);

// then move resized files back to staging folder
s3.moveObjects(quarantinedFiles, QUARANTINE_FOLDER, STAGING_FOLDER);
