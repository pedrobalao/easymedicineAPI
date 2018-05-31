var express = require('express');
var router = express.Router();

var firebaseAuth = require('../auth/firebase')

router.post('/authorize', function(req, res, next) {
  firebaseAuth(req.body.token).then(function(decodedToken) {
    res.status(200).send({msg: 'Valid token'})
  }).catch(function(error) {
    res.status(401).send({msg: 'Invalid token'})
  });
});

module.exports = router;