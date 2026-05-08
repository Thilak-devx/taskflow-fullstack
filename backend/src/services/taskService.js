const mongoose = require("mongoose");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");
const { sanitizeTaskPayload } = require("../utils/sanitize");

const ensureValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid resource id.");
  }
};

const buildTaskScope = (user) => (user.role === "admin" ? {} : { owner: user.id });

const buildSort = (sort) => {
  switch (sort) {
    case "oldest":
      return { createdAt: 1 };
    case "dueDate":
      return { dueDate: 1, createdAt: -1 };
    case "priority":
      return { priority: 1, createdAt: -1 };
    case "status":
      return { status: 1, createdAt: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
};

const listTasks = async (user, filters = {}) => {
  const query = buildTaskScope(user);

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } }
    ];
  }

  if (filters.status && filters.status !== "all") {
    query.status = filters.status;
  }

  if (filters.priority && filters.priority !== "all") {
    query.priority = filters.priority;
  }

  return Task.find(query).sort(buildSort(filters.sort));
};

const getTaskById = async (taskId, user) => {
  ensureValidId(taskId);

  const task = await Task.findOne({
    _id: taskId,
    ...buildTaskScope(user)
  });

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  return task;
};

const createTask = async (payload, user) =>
  Task.create({
    ...sanitizeTaskPayload(payload),
    owner: user.id
  });

const updateTask = async (taskId, payload, user) => {
  const task = await getTaskById(taskId, user);
  Object.assign(task, sanitizeTaskPayload(payload));
  await task.save();
  return task;
};

const deleteTask = async (taskId, user) => {
  const task = await getTaskById(taskId, user);
  await task.deleteOne();
};

module.exports = {
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
