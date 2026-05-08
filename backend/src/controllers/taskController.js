const asyncHandler = require("../utils/asyncHandler");
const taskService = require("../services/taskService");
const { sendSuccess } = require("../utils/response");

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.listTasks(req.user, req.query);
  sendSuccess(res, 200, { tasks });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user);
  sendSuccess(res, 200, { task });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.body, req.user);
  sendSuccess(res, 201, {
    message: "Task created successfully.",
    task
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.body, req.user);
  sendSuccess(res, 200, {
    message: "Task updated successfully.",
    task
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user);
  sendSuccess(res, 200, {
    message: "Task deleted successfully."
  });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};
