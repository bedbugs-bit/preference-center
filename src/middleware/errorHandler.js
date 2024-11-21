import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.originalUrl}`);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });

  next();
};
