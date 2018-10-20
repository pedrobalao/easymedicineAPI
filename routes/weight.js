var express = require('express');
var url = require('url');
var moment = require('moment');
var formutils = require('../utils/formulasutil');
var db = require('../utils/db');
var router = express.Router();

var growtype = 'WEIGHT';


router.get('/percentile/:gender/:birthdate/:weight', function(req, res, next) {


    let birthdate = moment(req.params.birthdate);
    let gender = req.params.gender;
    let weight = Number(req.params.weight);
    let qgender = 'M'; 

    if(gender === 'female')
    {
        qgender = 'F';
    }
    else if (gender != 'male')
    {
        res.status(400).send("Invalid gender");
        return;
    }

    let todaysDate = moment(new Date());
    let age = todaysDate.diff(birthdate, 'days');

    console.debug('weight - '+weight);
    console.debug('age - '+age);
    if (age > 1856)
    {
        res.status(400).send("Age cannot be bigger than 1856 days");
        return;
    }
    else if (age < 0)
    {
        res.status(400).send("Invalid birth date");
        return;
    }

    db.query('select P01, P1, P3, P5, P10, P15, P25, P50, P75, P85, P90, P95, P97, P99, P999 from childgrowstandards a ' +
                    'where growtype = \''+growtype+'\' and gender = \''+qgender+'\' and age = '+age+'', 
                    function(err, result,fields)  {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        let percentile = '';

                        resultAge = result[0];

                        console.debug('P01 - '+Number(resultAge.P01));
                        if (weight<=Number(resultAge.P01))
                        {
                            percentile = '0.1';       
                        }
                        else if (weight<=Number(resultAge.P1))
                        {
                            percentile = '1';       
                        }
                        else if (weight<=Number(resultAge.P3))
                        {
                            percentile = '3';       
                        }
                        else if (weight<=Number(resultAge.P5))
                        {
                            percentile = '5';       
                        }
                        else if (weight<=Number(resultAge.P10))
                        {
                            percentile = '10';       
                        }
                        else if (weight<=Number(resultAge.P15))
                        {
                            percentile = '15';       
                        }
                        else if (weight<=Number(resultAge.P25))
                        {
                            percentile = '25';       
                        }
                        else if (weight<=Number(resultAge.P50))
                        {
                            percentile = '50';       
                        }
                        else if (weight<=Number(resultAge.P75))
                        {
                            percentile = '75';       
                        }
                        else if (weight<=Number(resultAge.P85))
                        {
                            percentile = '85';       
                        }
                        else if (weight<=Number(resultAge.P90))
                        {
                            percentile = '90';       
                        }
                        else if (weight<=Number(resultAge.P95))
                        {
                            percentile = '95';       
                        }
                        else if (weight<=Number(resultAge.P97))
                        {
                            percentile = '97';       
                        }
                        else if (weight<=Number(resultAge.P99))
                        {
                            percentile = '99';       
                        }
                        else 
                        {
                            percentile = '99.9';       
                        }

                        let ret = {
                            percentile: percentile,
                            percentilesforage: resultAge 
                        };

                        res.status(200).json(ret);
                    });
});

module.exports = router;