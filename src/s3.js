const AWS = require('aws-sdk');

const {
  S3_BUCKET_NAME,
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
    // Prefix: 'STRING_VALUE',
  };
  const result = await s3.listObjectsV2(params).promise();
  console.log('listObjectsV2:', JSON.stringify(result, null, 2));
};

module.exports = {
  listObjects,
};
