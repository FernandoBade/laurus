import { createLogger, format, transports, addColors } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const logPath = path.join(__dirname, './logs/');

const customLevels = {
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        success: 5,
        info: 6,
        notice: 7,
    },
    colors: {
        emerg: 'magenta',
        alert: 'grey bold',
        crit: 'red',
        error: 'red bold',
        warning: 'yellow bold',
        success: 'green bold',
        info: 'green bold',
        notice: 'grey',
    },
};

addColors(customLevels.colors);

const logger = createLogger({
    levels: customLevels.levels,
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.json(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console({
            level: 'notice',
            format: format.combine(
                format.colorize({ all: true }),
                format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
            )
        }),
        new transports.DailyRotateFile({
            filename: `${logPath}/application-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'info',
            format: format.combine(
                format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
            ),
        }),
    ],
});

export default logger;

logger.emerg('Emergency situation! System is unusable.');
logger.alert('Action must be taken immediately to prevent data loss.');
logger.crit('Critical conditions, service might be unavailable.');
logger.error('Error conditions, something has failed.');
logger.warning('Warning conditions, something is not right.');
logger.info('Informational messages, everything is working as expected.');
logger.notice('Normal but significant condition, something to take note of.');
