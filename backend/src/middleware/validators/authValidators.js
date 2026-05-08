const { body } = require("express-validator");
const validateRequest = require("../validateRequest");

const nameRule = body("name")
  .trim()
  .isLength({ min: 2, max: 60 })
  .withMessage("Name must be between 2 and 60 characters.");

const emailRule = body("email")
  .trim()
  .isEmail()
  .withMessage("Valid email is required.")
  .normalizeEmail();

const passwordRule = body("password")
  .isLength({ min: 8, max: 64 })
  .withMessage("Password must be between 8 and 64 characters.");

const registerValidation = [
  nameRule,
  emailRule,
  passwordRule,
  body("role")
    .optional()
    .isIn(["user"])
    .withMessage("Public registration only supports the user role."),
  validateRequest
];

const loginValidation = [
  emailRule,
  body("password").notEmpty().withMessage("Password is required."),
  validateRequest
];

const googleValidation = [
  body("credential").trim().notEmpty().withMessage("Google credential is required."),
  validateRequest
];

module.exports = {
  registerValidation,
  loginValidation,
  googleValidation
};
