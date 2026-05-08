const User = require("../models/User");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const { sanitizeUserPayload } = require("../utils/sanitize");

const updateProfile = async (userId, payload) => {
  const nextPayload = sanitizeUserPayload(payload);
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (nextPayload.email && nextPayload.email !== user.email) {
    const existingUser = await User.findOne({ email: nextPayload.email, _id: { $ne: userId } });

    if (existingUser) {
      throw new ApiError(409, "That email is already in use.");
    }
  }

  if (nextPayload.name) {
    user.name = nextPayload.name;
  }

  if (nextPayload.email) {
    user.email = nextPayload.email;
  }

  await user.save();
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.password) {
    throw new ApiError(400, "This account uses Google sign-in. Set a password from a linked account flow first.");
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  user.password = newPassword;
  user.tokenVersion += 1;
  await user.save();
  return user;
};

const deleteAccount = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  await Task.deleteMany({ owner: userId });
  await user.deleteOne();
};

module.exports = {
  updateProfile,
  changePassword,
  deleteAccount
};
