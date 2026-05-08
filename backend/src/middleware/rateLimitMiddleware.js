const rateLimit = require("express-rate-limit");

const buildLimiter = (options) =>
  rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  });

const apiLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300
});

const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication attempts. Please try again later."
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
