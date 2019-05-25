var express = require("express");
var db = require("../utils/db");
var router = express.Router();
var CryptoJS = require("crypto-js");
var Secrets = require("../config/secrets");
var moment = require("moment");

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

  var keyCodeWords = CryptoJS.enc.Hex.parse(
    "000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F"
  );
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
  res.status(200).json(encrypted.ciphertext.toString());
});

router.get("/:id", function(req, res, next) {
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

  db.query(
    "select id, minappversion, maxappversion, file from appdbversions where id = " +
      id +
      "",
    function(err, result, fields) {
      if (err) {
        console.error(err);
        res.status(500).send(err.message);
        return;
      }

      let strBase64 = new Buffer(result[0].file, "binary").toString("base64");

      let file = {
        base64: strBase64
      };
      res.status(200).json(file);
    }
  );
});

module.exports = router;
