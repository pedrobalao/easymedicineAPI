var express = require('express');
var sql = require('mssql');
var router = express.Router();

// router.use(require('../auth/middleware'))

/* GET unities listing. */
router.get('/', function(req, res, next) {
    var request = new sql.Request();
    request.query('select Id from smartwalletservice.Unity', function(err, result) {
        if (err) {
          console.error(err);
          res.status(500).send(err.message);
          return;
        }
        res.status(200).json(result.recordset);
    });
});



module.exports = router;