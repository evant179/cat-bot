const AWS = require('aws-sdk');
const fs = require('fs');

const {
  S3_BUCKET_NAME,
  // credentials for aws-sdk usage:
  //   - if running locally, these will be set
  //   - otherwise, when running within lambda, these won't be set
  //       and permission is gained from its IAM role
  LOCAL_AWS_ACCESS_KEY_ID,
  LOCAL_AWS_SECRET_ACCESS_KEY
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

const listObjects = async (prefix) => {
  const s3 = createS3Client();
  const params = {
    Bucket: S3_BUCKET_NAME,
    Prefix: prefix,
    // start after the prefix so the response won't
    //   include the "folder" object key
    StartAfter: prefix,
  };
  const result = await s3.listObjectsV2(params).promise();
  const { Contents: objects } = result;
  console.log(`Number of objects found inside '${prefix}': ${objects.length}`);
  return objects;
};

const getObject = async (key) => {
  const s3 = createS3Client();
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
  };
  const { Body: buffer } = await s3.getObject(params).promise();
  return buffer;
};

const moveObject = async (key, oldPrefix, newPrefix) => {
  console.log(`Attempt to moveObject -- key '${key}' from '${oldPrefix}' to '${newPrefix}'`);
  // s3 does not offer a 'move', instead, perform a 'copy' then 'delete'
  const s3 = createS3Client();

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

const uploadFile = (fileName, targetFolder) => {
  const s3 = createS3Client();
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
      Bucket: targetFolder,//S3_BUCKET_NAME, //this needs to point to uploads folder
      Key: fileName, // File name you want to save as in S3
      Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw `Could not upload to s3 bucket. Error: ${err}`;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  });
};


module.exports = {
  getObject,
  listObjects,
  moveObject,
  moveObjects,
  uploadFile,
};
