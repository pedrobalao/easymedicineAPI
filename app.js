const dotenv = require('dotenv')
dotenv.config()

const appRoot = require('app-root-path');
global.appRoot = appRoot;
global.require = require('./config/require')

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const cors = require('cors')
const app = express();

const winston = global.require.use('Config/Winston');
global.logger = winston;

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

global.diContainer = require('./di/index')()

global.require.use('Routes/Init')(app);

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const secrets = global.require.use('Config/Secrets');
global.secrets = secrets;

module.exports = app;
