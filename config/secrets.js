const secrets = {
  db: {
    config: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      ssl: true
    }
  },
  dbsecretkey: {
    key: process.env.DBSECRETKEY
  },
  aws: {
    AccessKeyID: process.env.AWS_ACCESSKEYID,
    SecretAccessKey: process.env.AWS_SECRETACCESSKEY
  }
};

module.exports = secrets;
