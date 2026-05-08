const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error.";
  let errors = err.errors;

  if (err.name === "ValidationError") {
    statusCode = 422;
    message = "Validation failed.";
    errors = Object.values(err.errors).map((item) => ({
      field: item.path,
      message: item.message
    }));
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id.";
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || "resource";
    message = `A ${field} with that value already exists.`;
  }

  const response = {
    success: false,
    statusCode,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
