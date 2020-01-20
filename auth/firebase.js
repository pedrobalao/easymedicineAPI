
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});


module.exports = function(token) {
    console.log(token);
    return admin.auth().verifyIdToken(token);
}
