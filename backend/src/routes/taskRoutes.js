const express = require("express");
const taskController = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  taskValidation,
  taskUpdateValidation,
  taskQueryValidation,
  taskIdParamValidation
} = require("../middleware/validators/taskValidators");

const router = express.Router();

router.use(protect, authorize("user", "admin"));

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: List tasks
 *     description: Returns tasks visible to the authenticated user. Admin users can access all tasks, while normal users only receive their own tasks.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive search across task title and description.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, todo, in-progress, completed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [all, low, medium, high]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, dueDate, priority, status]
 *     responses:
 *       200:
 *         description: Task list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskListResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   tasks:
 *                     - _id: 681c7f97f1138cf18b6d5b70
 *                       title: Ship internship portfolio update
 *                       description: Refresh project screenshots and push the final README updates.
 *                       status: in-progress
 *                       priority: high
 *                       dueDate: 2026-05-15T18:30:00.000Z
 *                       owner: 681c7edaf1138cf18b6d5b67
 *                       createdAt: 2026-05-08T12:30:00.000Z
 *                       updatedAt: 2026-05-08T12:45:00.000Z
 *       401:
 *         description: Missing or invalid JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Invalid filter or sort query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get("/", taskQueryValidation, taskController.getTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get task by id
 *     description: Returns a single task if it exists and is visible to the authenticated user.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB task id
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccess'
 *                 - type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid task id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.get("/:id", taskIdParamValidation, taskController.getTask);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a task
 *     description: Creates a new task owned by the authenticated user.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: Task created successfully.
 *                   task:
 *                     _id: 681c7f97f1138cf18b6d5b70
 *                     title: Prepare recruiter demo
 *                     description: Record a walkthrough showing auth, CRUD, and dashboard stats.
 *                     status: todo
 *                     priority: medium
 *                     dueDate: 2026-05-18T10:00:00.000Z
 *                     owner: 681c7edaf1138cf18b6d5b67
 *                     createdAt: 2026-05-08T12:30:00.000Z
 *                     updatedAt: 2026-05-08T12:30:00.000Z
 *       422:
 *         description: Invalid task payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post("/", taskValidation, taskController.createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     description: Updates a task if it exists and is visible to the authenticated user.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskResponse'
 *       400:
 *         description: Invalid task id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Task not found
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
router.patch("/:id", taskIdParamValidation, taskUpdateValidation, taskController.updateTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Deletes a task if it exists and is visible to the authenticated user.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB task id
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid task id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete("/:id", taskIdParamValidation, taskController.deleteTask);

module.exports = router;
