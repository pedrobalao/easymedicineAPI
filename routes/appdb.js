var express = require("express");
var db = require("../utils/db");
var router = express.Router();
var CryptoJS = require("crypto-js");
var Secrets = require("../config/secrets");
var moment = require("moment");
const awsHelper = require("../utils/awshelper");

//router.use(require('../auth/middleware'))

/* GET unities listing. */
router.get("/", function(req, res, next) {
  db.query(
    "select id, minappversion, maxappversion from appdbversions",
    function(err, result, fields) {
      if (err) {
        console.error(err);
        res.status(500).send(err.message);
        return;
      }
      res.status(200).json(result);
    }
  );
});

// appdb/latest/123
router.get("/latest", function(req, res, next) {
  let appversion = req.query.appversion;

  db.query(
    "select max(id) id from appdbversions where minappversion >= " +
      appversion +
      " and maxappversion <= " +
      appversion +
      "",
    function(err, result, fields) {
      if (err) {
        console.error(err);
        res.status(500).send(err.message);
        return;
      }
      if (result[0].id == null) {
        res.status(200).json(null);
      } else {
        res.status(200).json(result[0]);
      }
    }
  );
});

// appdb/gentoken
router.get("/gentoken", function(req, res, next) {
  let date = moment.utc().format("YYYYMMDDHHmmss");

  let str = JSON.stringify({
    id: 17,
    app: "easyPed",
    date: date
  });

  var keyCodeWords = CryptoJS.enc.Hex.parse(Secrets.dbsecretkey.key);
  var ivCodeWords = CryptoJS.enc.Hex.parse("202122232425262728292A2B2C2D2E2F");

  var encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(str),

    keyCodeWords,
    {
      iv: ivCodeWords,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  console.log(encrypted.ciphertext.toString());

  let ret = {
    cipher: encrypted.ciphertext.toString(),
    iv: "202122232425262728292A2B2C2D2E2F"
  };

  res.status(200).json(ret);
});

router.get("/:id", async function(req, res, next) {
  let id = req.params.id;
  let token = req.query.token;
  let iv = req.query.iv;
  //validate token

  var keyCodeWords = CryptoJS.enc.Hex.parse(Secrets.dbsecretkey.key);
  var ivCodeWords = CryptoJS.enc.Hex.parse(iv);
  console.log(iv);
  console.log(token);

  var bytes = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Hex.parse(token) },
    keyCodeWords,
    {
      iv: ivCodeWords,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    }
  );
  console.log("Str " + bytes.toString(CryptoJS.enc.Utf8));

  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  console.log(decryptedData);

  if (
    decryptedData.id != id ||
    decryptedData.app != "easyPed" ||
    decryptedData.date == null
  ) {
    res.status(401).send("Unauthorize");
    return;
  }

  let date = moment.utc(decryptedData.date, "YYYYMMDDHHmmss");

  if (
    date > moment.utc().add(3, "minutes") ||
    date < moment.utc().add(-3, "minutes")
  ) {
    res.status(401).send("Unauthorize");
    return;
  }
//   console.log('b1');
//   let url = await awsHelper.getObjectUrl(
//     'easyped',
//     'easyPedDBV16.db3.zip'
//   );
//   console.log('b2 - '+url);
//   let file = {
//     id: result[0].id,
//     name: result[0].awskey,
//     url: url
//   };

//   res.status(200).json(file);

  db.query(
    "select id, minappversion, maxappversion, bucket, awskey from appdbversions where id = " +
      id +
      "",
    function(err, result, fields) {
      if (err) {
        console.error(err);
        res.status(500).send(err.message);
        return;
      }

      console.log('a1');
      console.log(awsHelper.getObjectUrl);

      const urlProm = awsHelper.getObjectUrl(
        result[0].bucket,
        result[0].awskey
      );

      console.log(urlProm);
      urlProm.then((data) => {
        let file = {
            id: result[0].id,
            name: result[0].awskey,
            url: data
          };
        
        console.log('a2 - '+url);  
        res.status(200).json(file);  
      });
    }
  );

  console.log('done');
  
});

module.exports = router;
