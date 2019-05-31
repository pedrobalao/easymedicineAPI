const AWS = require("aws-sdk");
const S3 = require("aws-sdk/clients/s3");
const secrets = require("../config/secrets");
const util = require("util");

module.exports = {
  getObjectUrl: function(bucket, key) {
    console.log("1");

    const s3 = new AWS.S3({ region: "eu-west-3", signatureVersion: "v4" ,accessKeyId: secrets.aws.AccessKeyID,secretAccessKey: secrets.aws.SecretAccessKey });
 
    const ret = s3.getSignedUrl("getObject", {
      Bucket: bucket,
      Key: key,
      Expires: 60 * 1
    });

    return ret;
  }
};
