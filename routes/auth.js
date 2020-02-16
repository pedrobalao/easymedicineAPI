var express = require('express');
var router = express.Router();
var db = require('../utils/db');

var firebaseAuth = require('../auth/firebase')

router.post('/authorize', function(req, res, next) {
  firebaseAuth(req.body.token).then(function(decodedToken) {
    res.status(200).send({msg: 'Valid token'})
  }).catch(function(error) {
    res.status(401).send({msg: 'Invalid token'})
  });
});

router.get('/login', function(req, res, next) {
  
    let query = 'select uid, type' 
    +' from firebase_users where uid = \''+req.body.userid+'\'';
    
    db.query(query, function(err, result, fields) {
        if (err) {
          console.error(err);
          res.status(500).send(err.message);
          return;
        }
        if(result.length == 0){
          db.query('insert into firebase_users (uid) values (\''+req.body.userid+'\')', function(err, result, fields) {
            if (err) {
              console.error(err);
              res.status(500).send(err.message);
              return;
            }
            res.status(200).json({has_type: false});   
            return;
          });    
        }
        else {
          if(result[0].type == null){
            res.status(200).json({has_type: false});
            return;
          }
          else{
            res.status(200).json({has_type: true});
            return;
          }
        }
    });
});


router.post('/usertype', function(req, res, next) {
  
  let query = 'update firebase_users set type = \''+req.body.type+'\', professional_id = \''+req.body.professional_id+'\'' 
  +' where uid = \''+req.body.userid+'\'';
  
  db.query(query, function(err, result, fields) {
      if (err) {
        console.error(err);
        res.status(500).send(err.message);
        return;
      }
      res.status(200).json({success: true});;
      return;
  });
});

module.exports = router;