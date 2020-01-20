var express = require('express');
var db = require('../utils/db');
var router = express.Router();

//router.use(require('../auth/middleware'))


/* GET unities listing. */
router.get('/', function(req, res, next) {
    let query = 'select id, description' 
    +' from diseases where status = \'active\' order by description';
    
    db.query(query, function(err, result, fields) {
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
   
    let query = 'SELECT id, description, indication FROM diseases WHERE status = \'active\' and MATCH (description , indication) AGAINST (\''+searchstr+'\'  IN NATURAL LANGUAGE MODE) LIMIT 50';

    db.query(query, 
                    function(err, result, fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result);
                    });
});

router.get('/:id', function(req, res, next) {
    console.log('getid')
    let id = req.params.id;
    db.query('select id, description, author, indication, followup, example, bibliography, observation, created_at, updated_at, treatment_description, status' 
        +' from diseases where status = \'active\' and id = '+id, 
                    function(err, result,fields)  {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result);
                    });
});





module.exports = router;