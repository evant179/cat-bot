const AWS = require('aws-sdk');
const fs = require('fs');

const {
  S3_BUCKET_NAME,
  // credentials for aws-sdk usage:
  //   - if running locally, these will be set
  //   - otherwise, when running within lambda, these won't be set
  //       and permission is gained from its IAM role
  LOCAL_AWS_ACCESS_KEY_ID,
  LOCAL_AWS_SECRET_ACCESS_KEY,
} = process.env;

const createS3Client = () => {
  const awsCredentials = LOCAL_AWS_ACCESS_KEY_ID ? {
    accessKeyId: LOCAL_AWS_ACCESS_KEY_ID,
    secretAccessKey: LOCAL_AWS_SECRET_ACCESS_KEY,
  } : {};

  return new AWS.S3({
    ...awsCredentials,
    maxRetries: 5,
    // delays (ms): 300, 600, 1200, ...
    retryDelayOptions: { base: 300 },
  });
};

const listObjects = async (prefix, s3 = createS3Client()) => {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Prefix: prefix,
    // start after the prefix so the response won't
    //   include the "folder" object key
    StartAfter: prefix,
  };
  const objects = [];
  let nextToken;

  // listObjectsV2 returns a max of 1000 objects, loop until exhausted
  do {
    /* eslint-disable no-await-in-loop */
    const result = await s3.listObjectsV2({
      ...params,
      ContinuationToken: nextToken,
    }).promise();

    objects.push(...result.Contents);
    nextToken = result.NextContinuationToken;
  } while (nextToken);

  console.log(`Number of objects found inside '${prefix}': ${objects.length}`);
  return objects;
};

const listRawFileNames = async (folders) => {
  const results = await Promise.all(
    folders.map((folder) => listObjects(folder)),
  );

  const rawFileNames = results.flat().map((object) => {
    const { Key: key } = object;
    // Get only the filename without the path. For example, given "/path/xyz.jpg", get "xyz.jpg"
    return key.split('/').pop();
  });

  console.log(`Total number of files found across folders [${folders}]: ${rawFileNames.length}`);
  return rawFileNames;
};

const getObject = async (key, s3 = createS3Client()) => {
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  };
  const { Body: buffer } = await s3.getObject(params).promise();
  return buffer;
};

const moveObject = async (key, oldPrefix, newPrefix, s3 = createS3Client()) => {
  // s3 does not offer a 'move', instead, perform a 'copy' then 'delete'
  console.log(`Attempt to moveObject -- key '${key}' from '${oldPrefix}' to '${newPrefix}'`);

  const newKey = key.replace(oldPrefix, newPrefix);
  const copyParams = {
    Bucket: S3_BUCKET_NAME, // destination bucket
    CopySource: `/${S3_BUCKET_NAME}/${key}`, // target /bucket/key
    Key: newKey, // destination key
  };
  await s3.copyObject(copyParams).promise();

  const deleteParams = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  };
  await s3.deleteObject(deleteParams).promise();
  console.log(`moveObject completed. Moved key '${key}' from '${oldPrefix}' to '${newPrefix}'`);
};

const moveObjects = async (objects, oldPrefix, newPrefix) => {
  await Promise.all(objects.map(async (imageFile) => {
    const { Key: key } = imageFile;
    await moveObject(key, oldPrefix, newPrefix);
  }));
  console.log(`Reset completed. ${newPrefix} folder is now repopulated`);
};

const uploadObject = async (fileName, filePath, targetFolder, s3 = createS3Client()) => {
  if (!targetFolder) {
    throw new Error(`Invalid targetFolder value: ${targetFolder}`);
  }

  // Read content from the file
  const fileContent = fs.readFileSync(filePath);

  // Setting up S3 upload parameters
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: `${targetFolder}${fileName}`,
    Body: fileContent,
  };

  // Uploading files to the bucket
  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully: ${data.Location}`);
  } catch (err) {
    console.log(`Could not upload ${fileName} to s3 bucket. Error:`, err);
    throw err;
  }
};

const uploadFolderContents = async (folderContents, sourceFolder, targetFolder) => {
  try {
    await Promise.all(folderContents.map(async (file) => {
      const localFileSource = `${sourceFolder}${file}`;
      console.log(`Found file: ${file}...`);
      await uploadObject(file, localFileSource, targetFolder);
    }));
  } catch (err) {
    console.log(`Failed to upload all contents of ${sourceFolder}`, err);
    throw err;
  }
};

module.exports = {
  getObject,
  listObjects,
  listRawFileNames,
  moveObject,
  moveObjects,
  uploadObject,
  uploadFolderContents,
};
