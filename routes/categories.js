var express = require('express');
var db = require('../utils/db');
var router = express.Router();

//router.use(require('../auth/middleware'))

/* GET unities listing. */
router.get('/', function(req, res, next) {

    db.query('select Id, Description' 
        +' from ClinicalCategory order by Description', function(err, result,fields) {
        if (err) {
          console.error(err);
          res.status(500).send(err.message);
          return;
        }
        res.status(200).json(result);
    });
});

router.get('/search', function(req, res, next) {

    let searchstr = req.query.searchstr.toUpperCase();
    db.query('select Id, Description from ClinicalCategory a ' +
                    'where upper(Description) like \'%' 
                    + searchstr + '%\' order by Description', 
                    function(err, result,fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result);
                    });
});

router.get('/:id', function(req, res, next) {
    

    let id = req.params.id;
    db.query('select Id, Description from ClinicalCategory a ' +
                    'where Id = '+id, 
                    function(err, result,fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result);
                    });
});

router.get('/:id/subcategories', function(req, res, next) {
    

    let id = req.params.id;
     
    db.query('select Id, Description, CategoryId from SubCategory ' +
                    'where CategoryId = ' + id + ' order by Description', 
                    function(err, result,fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result);
                        
                    });
});

router.get('/:id/subcategories/:idsubcat', function(req, res, next) {
    

    let id = req.params.id;
    let idsubcat = req.params.idsubcat;
     
    db.query('select Id, Description, CategoryId from SubCategory ' +
                    'where Id = ' + idsubcat, 
                    function(err, result,fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result);
                        
                    });
});

router.get('/:id/subcategories/:idsubcat/drugs', function(req, res, next) {
    

    let id = req.params.id;
    let idsubcat = req.params.idsubcat;
     
    db.query('select a.* from Drug a inner join DrugCategory b on a.Id = b.DrugId ' +
                    ' where b.SubCategoryId = '+idsubcat+' order by Name', 
                    function(err, result,fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result);
                        
                    });
});



module.exports = router;