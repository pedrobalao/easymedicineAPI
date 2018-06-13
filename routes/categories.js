var express = require('express');
var sql = require('mssql');
var router = express.Router();

router.use(require('../auth/middleware'))

/* GET unities listing. */
router.get('/', function(req, res, next) {

    var request = new sql.Request();
    request.query('select Id, Description' 
        +' from smartwalletservice.ClinicalCategory order by Description', function(err, result) {
        if (err) {
          console.error(err);
          res.status(500).send(err.message);
          return;
        }
        res.status(200).json(result.recordset);
    });
});

router.get('/search', function(req, res, next) {
    var request = new sql.Request();

    let searchstr = req.query.searchstr.toUpperCase();
    request.query('select Id, Description from smartwalletservice.ClinicalCategory a ' +
                    'where upper(Description) like \'%' 
                    + searchstr + '%\' order by Description', 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result.recordset);
                    });
});

router.get('/:id', function(req, res, next) {
    var request = new sql.Request();

    let id = req.params.id;
    request.query('select Id, Description from smartwalletservice.ClinicalCategory a ' +
                    'where Id = '+id, 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result.recordset);
                    });
});

router.get('/:id/subcategories', function(req, res, next) {
    var request = new sql.Request();

    let id = req.params.id;
     
    request.query('select Id, Description, CategoryId from smartwalletservice.SubCategory ' +
                    'where CategoryId = ' + id + 'order by Description', 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result.recordset);
                        
                    });
});

router.get('/:id/subcategories/:idsubcat', function(req, res, next) {
    var request = new sql.Request();

    let id = req.params.id;
    let idsubcat = req.params.idsubcat;
     
    request.query('select Id, Description, CategoryId from smartwalletservice.SubCategory ' +
                    'where Id = ' + idsubcat, 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result.recordset);
                        
                    });
});

router.get('/:id/subcategories/:idsubcat/drugs', function(req, res, next) {
    var request = new sql.Request();

    let id = req.params.id;
    let idsubcat = req.params.idsubcat;
     
    request.query('select a.* from smartwalletservice.Drug a inner join smartwalletservice.DrugCategory b on a.Id = b.DrugId ' +
                    ' where b.SubCategoryId = '+idsubcat+' order by Name', 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result.recordset);
                        
                    });
});



module.exports = router;