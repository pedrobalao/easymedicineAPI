var express = require('express');
var db = require('../utils/db');
var math = require('mathjs');
var formutils = require('../utils/formulasutil');
var router = express.Router();

router.use(require('../auth/middleware'))

router.get('/', function(req, res, next) {
    
    db.query('select Id, Description, ResultUnitId, Observation, ResultType, `Precision`' 
        +' from MedicalCalculation order by Description', function(err, result,fields) {
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
    db.query('select Id, Description, ResultUnitId, Observation, ResultType, `Precision`' 
        +' from MedicalCalculation where Id = '+id, function(err, result,fields) {
        if (err) {
          console.error(err);
          res.status(500).send(err.message);
          return;
        }
        res.status(200).json(result);
    });
});

router.get('/:id/variables', function(req, res, next) {
    
    let id = req.params.id;

    var funcGetVals = function(element) {
        return new Promise(function(resolve, reject) {
            db.query('select Value from VariableValues a ' +
                                        'where VariableId = \'' + element.Id + '\' order by Value', 
                                        function(err, result,fields) {
                                            if (err) {
                                              console.error(err);
                                              res.status(500).send(err.message);
                                              reject(err);
                                            }

                                            let ret = {
                                                Id: element.Id, 
                                                Description: element.Description, 
                                                IdUnit: element.IdUnit, 
                                                Type: element.Type,
                                                Values: result 
                                            };

                                            resolve(ret);
                                        }
            );
        });
    };

    db.query('select a.Id, a.Description, a.IdUnit, a.Type from Variable a join VariableMedicalCalculation b on (a.Id = b.VariableId)' +
                    'where b.MedicalCalculationId = ' + id + ' order by a.Id', 
                    function(err, result,fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        let variables = [];
                        let tasks = [];
                        
                        variables = result;

                        variables.forEach(element => {
                            tasks.push(funcGetVals(element));
                        });
                        
                        Promise.all(tasks).then(function(resultsArray){
                            // do something after the loop finishes
                                res.status(200).json(resultsArray);
                            }).catch(function(err){
                            // do something when any of the promises in array are rejected
                                console.error(err);
                                res.status(500).send(err.message);
                                return;
                            });                        
                    });
});

router.get('/:id/calculation', function(req, res, next) {
    
    

    console.log('Teste');
    let calcId = req.params.id;
    console.log('data -> '+req.query.data);
    //let data = JSON.parse(decodeURIComponent(req.query.data));
    var data = JSON.parse(req.query.data);
    console.log('data -> '+data);



    db.query('select Id, Description, Formula, ResultUnitId, Observation, ResultType, `Precision`' 
                +' from MedicalCalculation where Id = '+calcId, 
                    function(err, result,fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        
                        try
                        {
                            let obj = result;
                            console.log(data);
                            
                            result.forEach(obj => {
                                let result= formutils.calculate(data, obj.Formula);;

                                if(obj.ResultType == 'NUMBER') {
                                    ret = {
                                        id: obj.Id,
                                        resultdescription: obj.Description,
                                        resultunit: obj.ResultUnitId,
                                        result: math.round(result, obj.Precision)
                                    };
                                } else {
                                    ret = {
                                        id: obj.Id,
                                        resultdescription: obj.Description,
                                        resultunit: obj.ResultUnitId,
                                        result: result
                                    };
                                }
                                res.status(200).json(ret);
                                return;
                                
                            });
                        }
                        catch(error)
                        {
                            console.log(error);
                            res.status(500).send(error);
                        }
                    });
});

module.exports = router;