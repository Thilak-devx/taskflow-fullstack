const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { sanitizeUserPayload } = require("../utils/sanitize");

const googleClient = new OAuth2Client();

const buildAuthPayload = (user) => ({
  id: user._id,
  role: user.role,
  tokenVersion: user.tokenVersion
});

const generateToken = (user, env) =>
  jwt.sign(buildAuthPayload(user), env.jwtSecret, {
    algorithm: "HS256",
    expiresIn: env.jwtExpiresIn
  });

const registerUser = async ({ name, email, password, role }) => {
  const payload = sanitizeUserPayload({ name, email });
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new ApiError(409, "A user with that email already exists.");
  }

  const user = await User.create({
    ...payload,
    password,
    role: role === "admin" ? "user" : role || "user"
  });
  return user;
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.password) {
    throw new ApiError(400, "This account uses Google sign-in. Continue with Google instead.");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return user;
};

const loginWithGoogle = async (credential, env) => {
  if (!env.googleClientId) {
    throw new ApiError(500, "Google sign-in is not configured.");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId
  });

  const payload = ticket.getPayload();

  if (!payload?.email || !payload.sub) {
    throw new ApiError(400, "Invalid Google account payload.");
  }

  let user = await User.findOne({
    $or: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }]
  });

  if (!user) {
    user = await User.create({
      name: payload.name?.trim() || payload.email.split("@")[0],
      email: payload.email.toLowerCase(),
      googleId: payload.sub,
      avatar: payload.picture || "",
      authProvider: "google",
      lastLoginAt: new Date()
    });

    return user;
  }

  user.name = payload.name?.trim() || user.name;
  user.avatar = payload.picture || user.avatar;
  user.googleId = user.googleId || payload.sub;
  if (user.authProvider === "local") {
    user.authProvider = "hybrid";
  }
  user.lastLoginAt = new Date();
  await user.save();
  return user;
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  loginWithGoogle
};
