const winston = require('winston');
const {format, transports} = require('winston');
const {timestamp, printf} = format;
const path = require('path');
const colors = require('colors');

require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
    filename: '%DATE%.log',
    datePattern: 'YYYYMMDD',
    zippedArchive: true,
    maxSize: '1000m',
    maxFiles: '14d',
    dirname: './logs'
});

function formatLevel(level) {
    if (level === 'error') return colors.red;
    if (level === 'info') return colors.green;
    if (level === 'warn') return colors.yellow;
    return colors.white;
}

function isEmpty(params) {
    if (!params) return true;
    if (params && Object.keys(params).length === 0) return true;
    return false;
}

const myFormat = printf(({timestamp, level, message, src, ...params}) => {
    return `${timestamp} [${formatLevel(level)(level.padEnd(5, ' '))}] - [${src.cyan}]: ${message} ${isEmpty(params) ? '' : JSON.stringify(params)}`;
});

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        timestamp(),
        myFormat,
    ),
    transports: [
        transport, new transports.Console()
    ],
});

module.exports = function createLogger(filePath) {
    const fileName = path.basename(filePath);
    return logger.child({src: fileName});
};