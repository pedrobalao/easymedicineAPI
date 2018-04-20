var express = require('express');
var sql = require('mssql');
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
                                PediatricDose: obj.PediatricDose,
                                IdUnityPediatricDose: obj.IdUnityPediatricDose,
                                AdultDose: obj.AdultDose,
                                IdUnityAdultDose: obj.IdUnityAdultDose,
                                TakesPerDay: obj.TakesPerDay,
                                MaxDosePerDay: obj.MaxDosePerDay,
                                IdUnityMaxDosePerDay: obj.IdUnityMaxDosePerDay,
                                obs: obj.obs
                            });
                            lastIndication = obj.IndicationText;
                        });

                        res.status(200).json(ret);
                    });
});



module.exports = router;