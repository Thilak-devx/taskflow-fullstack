const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env");
const { generateToken, registerUser, loginUser, loginWithGoogle } = require("../services/authService");
const { sendSuccess } = require("../utils/response");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  authProvider: user.authProvider,
  avatar: user.avatar || ""
});

const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  const token = generateToken(user, env);

  sendSuccess(res, 201, {
    message: "Registration successful.",
    token,
    user: sanitizeUser(user)
  });
});

const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  const token = generateToken(user, env);

  sendSuccess(res, 200, {
    message: "Login successful.",
    token,
    user: sanitizeUser(user)
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, {
    user: req.user
  });
});

const googleAuth = asyncHandler(async (req, res) => {
  const user = await loginWithGoogle(req.body.credential, env);
  const token = generateToken(user, env);

  sendSuccess(res, 200, {
    message: "Google sign-in successful.",
    token,
    user: sanitizeUser(user)
  });
});

module.exports = {
  register,
  login,
  getCurrentUser,
  googleAuth
};
