var express = require('express');
var url = require('url');
var sql = require('mssql');
var math = require('mathjs');
var Math = require('mathjs');
var formutils = require('../utils/formulasutil');
var router = express.Router();


/* GET unities listing. */
router.get('/', function(req, res, next) {
    var request = new sql.Request();

    let query = 'select Id,Name,ConterIndications,SecondaryEfects, ComercialBrands, Obs, Presentation' 
    +' from smartwalletservice.Drug order by Name';

    if(req.query.calculation === 'true'){
        query = 'select distinct Id,Name,ConterIndications,SecondaryEfects, ComercialBrands, Obs, Presentation '
         + 'from smartwalletservice.Drug a where a.Id in (select DrugId from smartwalletservice.Calculation) order by a.Name';
    }
    
    request.query(query, function(err, result) {
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

    console.log('Teste');
    let drugid = req.params.id;
    console.log('data -> '+req.query.data);
    //let data = JSON.parse(decodeURIComponent(req.query.data));
    var data = JSON.parse(req.query.data);
    console.log('data -> '+data);

    request.query('select Id, "Function" formula, ResultDescription, ResultIdUnit, Description from smartwalletservice.Calculation a ' +
                    'where DrugId = ' + drugid + 'order by a.Id', 
                    function(err, result) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        
                        try
                        {
                            let ret = [];
                            
                            // var scope = {
                            //     peso: 3
                            // }; 
                            
                            console.log(data);
                            // variables can be read from the scope

                            result.recordset.forEach((obj)=>{
                                console.log('Formula - '+obj.formula);
                                obj.formula = formutils.convertToMathjs(obj.formula);
                                console.log('Formula Mathjs- '+obj.formula);
                                var dose = math.eval(obj.formula, data);
                                let res = {
                                    id: obj.Id,
                                    resultdescription: obj.ResultDescription,
                                    resultunit: obj.ResultIdUnit,
                                    result: dose
                                };
                                ret.push(res);
                            });
                            res.status(200).json(ret);
                        }
                        catch(error)
                        {
                            console.log(error);
                            res.status(500).send(error);
                        }
                    });
});

module.exports = router;