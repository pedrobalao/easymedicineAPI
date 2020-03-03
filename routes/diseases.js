var express = require('express');
var router = express.Router();
const diseasesController = global.diContainer.get('controller.disease');

router.get('/', diseasesController.list);
router.get('/search', diseasesController.search);
router.get('/:id', diseasesController.getById);

module.exports = router;
