const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

module.exports = (token) => {
  global.logger.debug(token);
  return admin.auth().verifyIdToken(token);
}
