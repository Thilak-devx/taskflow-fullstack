const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const env = require("../config/env");
const { AUTH_PROVIDERS, USER_ROLES } = require("../utils/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "user"
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    avatar: {
      type: String,
      default: ""
    },
    authProvider: {
      type: String,
      enum: AUTH_PROVIDERS,
      default: "local"
    },
    tokenVersion: {
      type: Number,
      default: 0
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("validate", function ensurePasswordForLocal(next) {
  if (this.authProvider === "local" && !this.password) {
    this.invalidate("password", "Password is required for local accounts.");
  }

  next();
});

userSchema.pre("save", async function hashPassword(next) {
  if (!this.password || !this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
