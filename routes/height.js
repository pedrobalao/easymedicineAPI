var express = require("express");
var url = require("url");
var moment = require("moment");
var formutils = require("../utils/formulasutil");
var db = require("../utils/db");
var router = express.Router();

var growtype = "LENGTH";

router.get("/percentile/:gender/:birthdate/:height", function(req, res, next) {
  let birthdate = moment(req.params.birthdate);
  let gender = req.params.gender;
  let height = Number(req.params.height);
  let qgender = "M";

  if (gender === "female") {
    qgender = "F";
  } else if (gender != "male") {
    res.status(400).send("Invalid gender");
    return;
  }

  let todaysDate = moment(new Date());
  let age = todaysDate.diff(birthdate, "days");

  console.debug("height - " + height);
  console.debug("age - " + age);

  if (age < 0) {
    res.status(400).send("Invalid birth date");
    return;
  } else age > 0;

  let searchAge = age;
  let agetype = "D"; //days

  if (age < 1856) {
    searchAge = age;
    agetype = "D";
  } else if (age < 6580) {
    searchAge = todaysDate.diff(birthdate, "months");
    agetype = "M";
  } else if (age >= 6580) {
    res.status(400).send("Age cannot be bigger than 18 years");
    return;
  }

  console.debug("height - " + height);
  console.debug("age - "+agetype+" "+searchAge);

  db.query(
    "select P01, P1, P3, P5, P10, P15, P25, P50, P75, P85, P90, P95, P97, P99, P999 from childgrowstandards a " +
      "where growtype = '" +
      growtype +
      "' and gender = '" +
      qgender +
      "' and age = " +
      searchAge +
      " and age_type='" +
      agetype +
      "' ",

    function(err, result, fields) {
      if (err) {
        console.error(err);
        res.status(500).send(err.message);
        return;
      }
      let percentile = "";

      resultAge = result[0];

      console.debug("P01 - " + Number(resultAge.P01));
      if (height <= Number(resultAge.P01)) {
        percentile = "0.1";
      } else if (height <= Number(resultAge.P1)) {
        percentile = "1";
      } else if (height <= Number(resultAge.P3)) {
        percentile = "3";
      } else if (height <= Number(resultAge.P5)) {
        percentile = "5";
      } else if (height <= Number(resultAge.P10)) {
        percentile = formutils.calcpercentile(
          5,
          resultAge.P5,
          10,
          resultAge.P10,
          height
        );
      } else if (height < Number(resultAge.P15)) {
        percentile = formutils.calcpercentile(
          10,
          resultAge.P10,
          15,
          resultAge.P15,
          height
        );
      } else if (height < Number(resultAge.P25)) {
        percentile = formutils.calcpercentile(
          15,
          resultAge.P15,
          25,
          resultAge.P25,
          height
        );
      } else if (height < Number(resultAge.P50)) {
        percentile = formutils.calcpercentile(
          25,
          resultAge.P25,
          50,
          resultAge.P50,
          height
        );
      } else if (height < Number(resultAge.P75)) {
        percentile = formutils.calcpercentile(
          50,
          resultAge.P50,
          75,
          resultAge.P75,
          height
        );
      } else if (height < Number(resultAge.P85)) {
        percentile = formutils.calcpercentile(
          75,
          resultAge.P75,
          85,
          resultAge.P85,
          height
        );
      } else if (height < Number(resultAge.P90)) {
        percentile = formutils.calcpercentile(
          85,
          resultAge.P85,
          90,
          resultAge.P90,
          height
        );
      } else if (height < Number(resultAge.P95)) {
        percentile = formutils.calcpercentile(
          90,
          resultAge.P90,
          95,
          resultAge.P95,
          height
        );
      } else if (height < Number(resultAge.P97)) {
        percentile = "95";
      } else if (height < Number(resultAge.P99)) {
        percentile = "97";
      } else if (height < Number(resultAge.P999)) {
        percentile = "99";
      } else {
        percentile = "99.9";
      }

      let ret = {
        percentile: percentile,
        percentilesforage: resultAge
      };

      res.status(200).json(ret);
    }
  );
});

module.exports = router;
