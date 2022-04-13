const winston = require("winston");

export const hwBuilderLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
  ),
  defaultMeta: { service: "main" },
  transports: [
    new winston.transports.File({ filename: "logs/hw_builder.log" }),
  ],
});

// If not in production then log to the console
if (process.env.NODE_ENV !== "production") {
  hwBuilderLogger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
