var express = require('express');
var sql = require('mssql');
var router = express.Router();

router.get('/', function(req, res, next) {
    var request = new sql.Request();
    request.query('select Id, Description, ResultUnitId, Observation, ResultType, Precision' 
        +' from smartwalletservice.MedicalCalculation order by Description', function(err, result) {
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
    request.query('select Id, Description, ResultUnitId, Observation, ResultType, Precision' 
        +' from smartwalletservice.MedicalCalculation where Id = '+id, function(err, result) {
        if (err) {
          console.error(err);
          res.status(500).send(err.message);
          return;
        }
        res.status(200).json(result.recordset);
    });
});

router.get('/:id/variables', function(req, res, next) {
    var request = new sql.Request();
    let id = req.params.id;

    var funcGetVals = function(element) {
        return new Promise(function(resolve, reject) {
            request.query('select Value from smartwalletservice.VariableValues a ' +
                                        'where VariableId = \'' + element.Id + '\' order by Value', 
                                        function(err, result) {
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
                                                Values: result.recordset 
                                            };

                                            resolve(ret);
                                        }
            );
        });
    };

    request.query('select a.Id, a.Description, a.IdUnit, a.Type from smartwalletservice.Variable a join smartwalletservice.VariableMedicalCalculation b on (a.Id = b.VariableId)' +
                    'where b.MedicalCalculationId = ' + id + 'order by a.Id', 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        let variables = [];
                        let tasks = [];
                        
                        variables = result.recordset;

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

module.exports = router;