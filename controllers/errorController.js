const AppError = require("../utils/appError");

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJSONWebTokenError = () =>
  new AppError("Invalid token please login again.", 401);
const handleJWTExpiredError = () =>
  new AppError("Token expired please login againg", 401);
const handleCastError = (err) => {
  return new AppError(`Invalid ${err.path} ${err.value}`, 400);
};
const sendErrorDev = (err, req, res) => {
  // FOR API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // FOR RENDERED WEBSITE
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    // msg: err.message,
    msg: "This project for introducing API only",
  });
};

const sendErrorProd = (err, req, res) => {
  // FOR API
  if (req.originalUrl.startsWith("/api")) {
    // Operational Error
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or unknown error , don't leak error and log it
    console.log("ERROR", err);
    return res
      .status(500)
      .json({ status: "error", message: "Something went wrong" });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      // msg: err.message,
      msg: "This project for introducing API only",
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    // msg: "Please try again later.",
    msg: "This project for introducing API only",
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    error.errmsg = err.errmsg;
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJSONWebTokenError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (error.name === "CastError") error = handleCastError(error);

    sendErrorProd(error, req, res);
  }
};
