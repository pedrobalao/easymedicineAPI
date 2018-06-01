var express = require('express');
var sql = require('mssql');
var math = require('mathjs');
var formutils = require('../utils/formulasutil');
var router = express.Router();
router.use(require('../auth/middleware'))

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

router.get('/:id/calculation', function(req, res, next) {
    
    var request = new sql.Request();

    console.log('Teste');
    let calcId = req.params.id;
    console.log('data -> '+req.query.data);
    //let data = JSON.parse(decodeURIComponent(req.query.data));
    var data = JSON.parse(req.query.data);
    console.log('data -> '+data);



    request.query('select Id, Description, Formula, ResultUnitId, Observation, ResultType, Precision' 
                +' from smartwalletservice.MedicalCalculation where Id = '+calcId, 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        
                        try
                        {
                            let obj = result.recordset;
                            console.log(data);
                            
                            result.recordset.forEach(obj => {
                                console.log('Formula - '+obj.Formula);
                                
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