import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize } = format;
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});
const winstonOptions = {
  level: process.env.LOG_LEVEL || "info",
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp(), myFormat),
    }),
  ],
};
export const logger = createLogger(winstonOptions);
