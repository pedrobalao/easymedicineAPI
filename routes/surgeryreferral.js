var express = require('express');
var db = require('../utils/db');
var math = require('mathjs');
var formutils = require('../utils/formulasutil');
var router = express.Router();


var pediatricSugeries = [];

//router.use(require('../auth/middleware'))

router.get('/', function(req, res, next) {
    
    if (pediatricSugeries.length == 0)
    {

        let key = "PEDIATRIC_SURGERIES_REFERRAL";

        db.query('select DATA from MedicalInfo where ID = \''+key+'\'', 
            function(err, result,fields) {
                if (err) {
                    console.error(err);
                    res.status(500).send(err.message);
                    return;
                }

                console.info(result[0].DATA);
                var arr_from_json = JSON.parse(result[0].DATA);
                res.status(200).json(arr_from_json); 
            }
        );
    }
    else
    {
        res.status(401).json("shit happens");
    }

    
});


module.exports = router;