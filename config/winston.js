const winston = require('winston');
const appRoot = require('app-root-path');

const options = {
    combinedFile: {
        level: 'info',
        filename: `${appRoot}/logs/combined.log`,
        handleExceptions: true,
        json: false,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    errorFile: {
        level: 'error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        json: false,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = winston.createLogger({
    exitOnError: false,
    transports: [
        new winston.transports.File(options.combinedFile),
        new winston.transports.File(options.errorFile),
        new winston.transports.Console(options.console)
    ]
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, _encoding) {
        logger.info(message);
    },
};

module.exports = logger;
