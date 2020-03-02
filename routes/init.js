var express = require('express');
const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('../swagger.json');
const authmid = require('../auth/middleware')
const baseurl = '/api';
const v1 = baseurl + '/v1';

module.exports = (app, router) => {
    app.use('/', require('../routes/index'));
    app.use(baseurl + '/', require('../routes/index'));
    app.use(baseurl + '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(v1 + '/auth', authmid, require('../routes/auth'));
    app.use(v1 + '/users', require('../routes/users'));
    app.use(v1 + '/unities', require('../routes/unities'));
    app.use(v1 + '/drugs', require('../routes/drugs'));
    app.use(v1 + '/categories', require('../routes/categories'));
    app.use(v1 + '/medicalcalculations', require('../routes/medicalcalculations'));
    app.use(v1 + '/surgeryreferral', require('../routes/surgeryreferral'));
    app.use(v1 + '/weight', require('../routes/weight'));
    app.use(v1 + '/height', require('../routes/height'));
    app.use(v1 + '/bmi', require('../routes/bmi'));
    app.use(v1 + '/appdb', require('../routes/appdb'));

    app.use(v1 + '/diseases', authmid, require('../routes/diseases')(express.Router()));
}

