const express = require("express");
const authController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  registerValidation,
  loginValidation,
  googleValidation
} = require("../middleware/validators/authValidators");

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new account
 *     description: Creates a local user account and immediately returns a JWT for authenticated app access.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: Registration successful.
 *                   token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   user:
 *                     _id: 681c7edaf1138cf18b6d5b67
 *                     name: Aarav Patel
 *                     email: aarav@example.com
 *                     role: user
 *                     authProvider: local
 *                     avatar: ""
 *       409:
 *         description: Duplicate email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               duplicateEmail:
 *                 value:
 *                   success: false
 *                   statusCode: 409
 *                   message: A user with that email already exists.
 *       422:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post("/register", registerValidation, authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: Authenticates a local account and returns a JWT that should be used as a Bearer token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: Login successful.
 *                   token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   user:
 *                     _id: 681c7edaf1138cf18b6d5b67
 *                     name: Aarav Patel
 *                     email: aarav@example.com
 *                     role: user
 *                     authProvider: local
 *                     avatar: ""
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalidCredentials:
 *                 value:
 *                   success: false
 *                   statusCode: 401
 *                   message: Invalid email or password.
 *       429:
 *         description: Too many authentication attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post("/login", loginValidation, authController.login);

/**
 * @swagger
 * /api/v1/auth/google:
 *   post:
 *     summary: Sign in with Google
 *     description: Accepts a Google ID token credential, verifies it, creates or links the user, and returns a JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleAuthRequest'
 *     responses:
 *       200:
 *         description: Google sign-in successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid Google credential or unsupported account state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Google sign-in is not configured on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post("/google", googleValidation, authController.googleAuth);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get the current authenticated user
 *     description: Returns the user information derived from the validated JWT and current database state.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentUserResponse'
 *       401:
 *         description: Missing, expired, or invalid JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   success: false
 *                   statusCode: 401
 *                   message: Your session has expired. Please sign in again.
 *       403:
 *         description: Authenticated user lacks the required role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get("/me", protect, authorize("user", "admin"), authController.getCurrentUser);

module.exports = router;
