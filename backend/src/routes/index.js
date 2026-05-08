const express = require("express");
const authRoutes = require("./authRoutes");
const accountRoutes = require("./accountRoutes");
const taskRoutes = require("./taskRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/account", accountRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;
