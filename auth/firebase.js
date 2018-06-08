
var admin = require('firebase-admin');

var serviceAccount = require("../config/easymedicine-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});


module.exports = function(token) {
    return admin.auth().verifyIdToken(token);
}
