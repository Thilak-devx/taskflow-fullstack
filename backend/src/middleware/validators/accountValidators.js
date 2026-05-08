const { body } = require("express-validator");
const validateRequest = require("../validateRequest");

const updateProfileValidation = [
  body().custom((value) => {
    if (!value || (typeof value === "object" && !value.name && !value.email)) {
      throw new Error("Provide at least one field to update.");
    }

    return true;
  }),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters."),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Valid email is required.")
    .normalizeEmail(),
  validateRequest
];

const changePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  body("newPassword")
    .trim()
    .isLength({ min: 8, max: 64 })
    .withMessage("New password must be between 8 and 64 characters."),
  body("newPassword").custom((value, { req }) => {
    if (value === req.body.currentPassword) {
      throw new Error("New password must be different from the current password.");
    }

    return true;
  }),
  validateRequest
];

const deleteAccountValidation = [
  body("confirmation")
    .trim()
    .equals("DELETE")
    .withMessage("Confirmation must be DELETE."),
  validateRequest
];

module.exports = {
  updateProfileValidation,
  changePasswordValidation,
  deleteAccountValidation
};
