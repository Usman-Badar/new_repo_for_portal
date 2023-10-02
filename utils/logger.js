const { createLogger, transports, format } = require('winston')
const { combine, timestamp, label, printf } = format

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const file_logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: `logs/general/${new Date().toISOString().slice(0, 10).replace('T', ' ')}.log` })
    ]
});

const server_file_logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: `logs/server/${new Date().toISOString().slice(0, 10).replace('T', ' ')}.log` })
    ]
});

const console_logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [new transports.Console()]
})

module.exports = {
    file_logger: file_logger,
    console_logger: console_logger,
    server_file_logger: server_file_logger
}