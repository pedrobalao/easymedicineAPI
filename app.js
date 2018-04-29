var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sql = require('mssql'); // MS Sql Server client
var swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');


var secrets = require('./config/secrets');

// Connection string parameters.
var configdb = {
    user: secrets.db.user,
    password: secrets.db.password,
    server: secrets.db.server,
    database: secrets.db.database,
    options: secrets.db.options
};

//instantiate a connection pool
var conpool = new sql.connect(configdb);

// load routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var unitiesRouter = require('./routes/unities');
var drugsRouter = require('./routes/drugs');
var categoriesRouter = require('./routes/categories');
var cors = require('cors')

var app = express();

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


let baseurl = '/api';
let v1 = baseurl+'/v1';

// routes
app.use('/', indexRouter);
app.use(baseurl+'/', indexRouter);
app.use(baseurl+'/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(v1+'/users', usersRouter);
app.use(v1+'/unities', unitiesRouter);
app.use(v1+'/drugs', drugsRouter);
app.use(v1+'/categories', categoriesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(function(req,res,next){
  conpool.connect().catch(function(err) {
    console.error('Error creating connection pool', err);
  });
});



module.exports = app;
