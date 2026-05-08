const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env");
const accountService = require("../services/accountService");
const { generateToken } = require("../services/authService");
const { sendSuccess } = require("../utils/response");

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  authProvider: user.authProvider,
  avatar: user.avatar || ""
});

const getProfile = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, {
    user: req.user
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await accountService.updateProfile(req.user.id, req.body);
  const token = generateToken(user, env);

  sendSuccess(res, 200, {
    message: "Profile updated successfully.",
    token,
    user: sanitizeUser(user)
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await accountService.changePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );
  const token = generateToken(user, env);

  sendSuccess(res, 200, {
    message: "Password changed successfully. Other sessions have been logged out.",
    token,
    user: sanitizeUser(user)
  });
});

const deleteAccount = asyncHandler(async (req, res) => {
  await accountService.deleteAccount(req.user.id);

  sendSuccess(res, 200, {
    message: "Account deleted successfully."
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
};
