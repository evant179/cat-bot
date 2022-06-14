const AWS = require('aws-sdk');

const {
  S3_BUCKET_NAME,
  STAGING_FOLDER = 'staging/',
  TWEETED_FOLDER = 'tweeted/',
  QUARANTINE_FOLDER = 'quarantine/',
  // credentials for aws-sdk usage:
  //   - if running locally, these will set
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
  // console.log('listObjectsV2:', JSON.stringify(result, null, 2));
  const { Contents: objects } = result;
  console.log('Number of objects found:', objects.length);
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
};

const resetStaging = async (folderContentsArray) => {
  folderContentsArray.forEach((imageFile) => {
    const key = imageFile.Key
    moveObject(key, TWEETED_FOLDER, STAGING_FOLDER);
  })
}

module.exports = {
  getObject,
  listObjects,
  moveObject,
  resetStaging,
};
