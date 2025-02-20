import winston from "winston";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`
        })
    ),
    transports: [
        new winston.transports.Console(), // Logs to the console
        new winston.transports.File({
            filename: 'logs/error.log', // Logging to the errorFile
            level: 'error'
        })
    ],
});

export default logger;