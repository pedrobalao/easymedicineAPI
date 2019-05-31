const AWS = require("aws-sdk");
const secrets = require("../config/secrets");
const util = require("util");

module.exports = {
  getUrl: function(bucket, key) {
    const s3 = new AWS.S3({ region: "eu-west-3", signatureVersion: "v4" });

    AWS.config.update({
      accessKeyId: secrets.aws.AccessKeyID,
      secretAccessKey: secrets.aws.SecretAccessKey
    });

    let url = s3.getSignedUrl("getObject", {
      Bucket: bucket,
      Key: key,
      Expires: 60 * 1
    });
    console.log(url);

    // const getSignedUrlProm = util.promisify(s3.getSignedUrl);

    // await getSignedUrlProm("getObject", {
    //   Bucket: myBucket,
    //   Key: myKey,
    //   Expires: signedUrlExpireSeconds
    // })
    //   .then((err, url) => {
    //     if (err) throw err;
    //     retUrl = url;
    //     console.log(url);
    //   })
    //   .catch(err => {
    //     throw err;
    //   });

    // const url = s3.getSignedUrl(
    //   "getObject",
    //   {
    //     Bucket: myBucket,
    //     Key: myKey,
    //     Expires: signedUrlExpireSeconds
    //   },
    //   (err, url) => {
    //     if (err) throw err;
    //     retUrl = url;
    //     console.log(url);
    //   }
    // );
    return url;
  },
  getObjectUrl: function(bucket, key) {
    return new Promise((resolve, reject) => {
      console.log("1");

      const s3 = new AWS.S3({ region: "eu-west-3", signatureVersion: "v4" });
      AWS.config.update({
        accessKeyId: secrets.aws.AccessKeyID,
        secretAccessKey: secrets.aws.SecretAccessKey
      });
      console.log("2");
      console.log("3");
      s3.getSignedUrl(
        "getObject",
        { Bucket: bucket, Key: key, Expires: 60 * 1 },
        function(err, data) {
          console.log("4.1");
          if (err) {
            reject(err);
          } else {
            console.log("4");
            resolve(data);
          }
        }
      );
    });
  }
};
