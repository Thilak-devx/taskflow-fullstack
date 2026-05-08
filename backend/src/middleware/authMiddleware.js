const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Authorization token is required.");
  }

  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
  } catch (_error) {
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  if (decoded.tokenVersion !== user.tokenVersion) {
    throw new ApiError(401, "Your session is no longer valid. Please sign in again.");
  }

  req.user = {
    id: user._id.toString(),
    role: user.role,
    name: user.name,
    email: user.email,
    authProvider: user.authProvider,
    avatar: user.avatar || "",
    tokenVersion: user.tokenVersion
  };

  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have access to this resource."));
  }

  next();
};

module.exports = {
  protect,
  authorize
};
