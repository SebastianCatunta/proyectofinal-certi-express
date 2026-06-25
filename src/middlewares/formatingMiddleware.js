export function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicated value in database";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null
  });
}

export function responseFormatter(req, res, next) {
  res.success = function (statusCode, message, data = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };

  next();
}