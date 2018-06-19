var express = require('express');
var db = require('../utils/db');
var router = express.Router();

// router.use(require('../auth/middleware'))

/* GET unities listing. */
router.get('/', function(req, res, next) {
    db.query('select Id from Unity', function(err, result,fields) {
        if (err) {
          console.error(err);
          res.status(500).send(err.message);
          return;
        }
        res.status(200).json(result);
    });
});



module.exports = router;