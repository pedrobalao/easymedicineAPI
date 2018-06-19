var express = require('express');
var url = require('url');
var math = require('mathjs');
var Math = require('mathjs');
var formutils = require('../utils/formulasutil');
var db = require('../utils/db');
var router = express.Router();

// router.use(require('../auth/middleware'))


/* GET unities listing. */
router.get('/', function(req, res, next) {
    
    let query = 'select Id,Name,ConterIndications,SecondaryEfects, ComercialBrands, Obs, Presentation' 
    +' from Drug order by Name';

    if(req.query.calculation === 'true'){
        query = 'select distinct Id,Name,ConterIndications,SecondaryEfects, ComercialBrands, Obs, Presentation '
         + 'from Drug a where a.Id in (select DrugId from Calculation) order by a.Name';
    }
    
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
    db.query('select distinct a.* from Drug a join Indication b on (a.Id = b.DrugId) ' +
                    'where upper(Name) like \'%' 
                    + searchstr + '%\' or ComercialBrands like \'%'+searchstr+'%\' or upper(IndicationText) like \'%'+searchstr+'%\'', 
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

    let drugid = req.params.id;
    db.query('select distinct a.* from Drug a ' +
                    'where Id = '+drugid, 
                    function(err, result,fields)  {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        res.status(200).json(result);
                    });
});

router.get('/:id/indications', function(req, res, next) {

    let drugid = req.params.id;
     
    db.query('select a.IndicationText, b.* from Indication a join Dose b on (a.Id = b.IndicationId)' +
                    'where DrugId = ' + drugid + 'order by a.Id', 
                    function(err, result,fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }
                        let lastIndication = '';
                        let ret = [];
                        let indcationCounter = -1;
                        result.forEach((obj)=>{
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

    let drugid = req.params.id;
     
    db.query('select a.Id, a.Description, a.IdUnit, a.Type from Variable a join VariableDrug b on (a.Id = b.VariableId)' +
                    'where b.DrugId = ' + drugid + 'order by a.Id', 
                    function(err, result,fields) {
                        if (err) {
                          console.error(err);
                          res.status(500).send(err.message);
                          return;
                        }

                        res.status(200).json(result);
                    });
});

router.get('/:id/calculation', function(req, res, next) {
    

    console.log('Teste');
    let drugid = req.params.id;
    console.log('data -> '+req.query.data);
    //let data = JSON.parse(decodeURIComponent(req.query.data));
    var data = JSON.parse(req.query.data);
    console.log('data -> '+data);

    db.query('select Id, "Function" formula, ResultDescription, ResultIdUnit, Description from Calculation a ' +
                    'where DrugId = ' + drugid + 'order by a.Id', 
                    function(err, result, fields) {
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

                            result.forEach((obj)=>{
                                console.log('Formula - '+obj.formula);
                                // obj.formula = formutils.convertToMathjs(obj.formula);
                                // console.log('Formula Mathjs- '+obj.formula);
                                // var dose = math.eval(obj.formula, data);
                                var dose = formutils.calculate(data,obj.formula);
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