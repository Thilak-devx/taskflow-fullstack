const express = require("express");
const accountController = require("../controllers/accountController");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  updateProfileValidation,
  changePasswordValidation,
  deleteAccountValidation
} = require("../middleware/validators/accountValidators");

const router = express.Router();

router.use(protect, authorize("user", "admin"));

/**
 * @swagger
 * /api/v1/account/profile:
 *   get:
 *     summary: Get account profile
 *     description: Returns the authenticated account profile from the validated JWT payload.
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current account profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentUserResponse'
 *       401:
 *         description: Missing or invalid JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get("/profile", accountController.getProfile);

/**
 * @swagger
 * /api/v1/account/profile:
 *   patch:
 *     summary: Update account profile
 *     description: Updates the authenticated user's name or email and returns a refreshed JWT plus the updated user payload.
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Invalid update payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.patch("/profile", updateProfileValidation, accountController.updateProfile);

/**
 * @swagger
 * /api/v1/account/password:
 *   post:
 *     summary: Change account password
 *     description: Updates the local account password, increments token version, and returns a fresh JWT while invalidating older sessions.
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileResponse'
 *       400:
 *         description: Unsupported account state or invalid password change request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Current password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post("/password", changePasswordValidation, accountController.changePassword);

/**
 * @swagger
 * /api/v1/account:
 *   delete:
 *     summary: Delete account permanently
 *     description: Deletes the authenticated user and all tasks owned by that user. Requires confirmation body value `DELETE`.
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteAccountRequest'
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: Account deleted successfully.
 *       422:
 *         description: Missing or invalid confirmation value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete("/", deleteAccountValidation, accountController.deleteAccount);

module.exports = router;
