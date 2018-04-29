var express = require('express');
var sql = require('mssql');
var math = require('mathjs');
var router = express.Router();


/* GET unities listing. */
router.get('/', function(req, res, next) {
    var request = new sql.Request();
    request.query('select Id,Name,ConterIndications,SecondaryEfects, ComercialBrands, Obs, Presentation' 
        +' from smartwalletservice.Drug', function(err, result) {
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
    request.query('select distinct a.* from smartwalletservice.Drug a join smartwalletservice.Indication b on (a.Id = b.DrugId) ' +
                    'where upper(Name) like \'%' 
                    + searchstr + '%\' or ComercialBrands like \'%'+searchstr+'%\' or upper(IndicationText) like \'%'+searchstr+'%\'', 
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

    let drugid = req.params.id;
    request.query('select distinct a.* from smartwalletservice.Drug a ' +
                    'where Id = '+drugid, 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result.recordset);
                    });
});

router.get('/:id/indications', function(req, res, next) {
    var request = new sql.Request();

    let drugid = req.params.id;
     
    request.query('select a.IndicationText, b.* from smartwalletservice.Indication a join smartwalletservice.Dose b on (a.Id = b.IndicationId)' +
                    'where DrugId = ' + drugid + 'order by a.Id', 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        let lastIndication = '';
                        let ret = [];
                        let indcationCounter = -1;
                        result.recordset.forEach((obj)=>{
                            console.log(obj);
                            if(!lastIndication || lastIndication != obj.IndicationText)
                            {
                                indcationCounter++;
                                ret[indcationCounter] = {
                                    IndicationText: obj.IndicationText,
                                    Doses: []
                                };
                            }
                        
                            ret[indcationCounter].Doses.push({
                                IdVia: obj.IdVia,
                                PediatricDose: obj.PediatricDose + ' ' + obj.IdUnityPediatricDose,
                                AdultDose: obj.AdultDose + ' ' + obj.IdUnityAdultDose,
                                TakesPerDay: obj.TakesPerDay,
                                MaxDosePerDay: obj.MaxDosePerDay + ' ' + obj.IdUnityMaxDosePerDay,
                                obs: obj.obs
                            });
                            lastIndication = obj.IndicationText;
                        });

                        res.status(200).json(ret);
                    });
});

router.get('/:id/variables', function(req, res, next) {
    var request = new sql.Request();

    let drugid = req.params.id;
     
    request.query('select a.Id, a.Description, a.IdUnit, a.Type from smartwalletservice.Variable a join smartwalletservice.VariableDrug b on (a.Id = b.VariableId)' +
                    'where b.DrugId = ' + drugid + 'order by a.Id', 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }

                        res.status(200).json(result.recordset);
                    });
});

router.get('/:id/calculation', function(req, res, next) {
    var request = new sql.Request();

    let drugid = req.params.id;

    let data = req.query.data;

    request.query('select "Function" formula, ResultDescription, ResultIdUnit, Description from smartwalletservice.Calculation a ' +
                    'where DrugId = ' + drugid + 'order by a.Id', 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        let ret = [];
                        

                         var scope = {
                            peso: 3
                        }; 
                        
                        console.log(data);
                        // variables can be read from the scope

                        result.recordset.forEach((obj)=>{
                            //obj.formula = 'peso * 30';
                            console.log(math.eval(obj.formula, scope));
                            let res = {
                                resultdescription: obj.ResultDescription,
                                resultunit: obj.ResultIdUnit//,
                                //result: math.eval(obj.formula, data)
                            };
                            ret.push(res);
                        });
                        res.status(200).json(ret);
                    });
});

module.exports = router;