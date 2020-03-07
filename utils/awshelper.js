const AWS = require("aws-sdk");
const secrets = require(`${global.appRoot}/config/secrets`);

module.exports = {
  getObjectUrl: function (bucket, key) {
    global.logger.debug(`bucket->${bucket} key->${key}`);

    const s3 = new AWS.S3({
      region: "eu-west-3",
      signatureVersion: "v4",
      accessKeyId: secrets.aws.AccessKeyID,
      secretAccessKey: secrets.aws.SecretAccessKey
    });

    const ret = s3.getSignedUrl("getObject", {
      Bucket: bucket,
      Key: key,
      Expires: 60 * 1
    });

    return ret;
  }
};
