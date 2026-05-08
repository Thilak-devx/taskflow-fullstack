const { body, param, query } = require("express-validator");
const { TASK_PRIORITIES, TASK_STATUSES } = require("../../utils/constants");
const validateRequest = require("../validateRequest");

const titleRule = body("title")
  .trim()
  .isLength({ min: 1, max: 120 })
  .withMessage("Title must be between 1 and 120 characters.");

const descriptionRule = body("description")
  .optional()
  .trim()
  .isLength({ max: 1000 })
  .withMessage("Description cannot exceed 1000 characters.");

const dueDateRule = body("dueDate")
  .optional({ nullable: true })
  .custom((value) => value === null || !Number.isNaN(new Date(value).getTime()))
  .withMessage("Due date must be a valid date.");

const taskValidation = [
  titleRule,
  descriptionRule,
  body("status")
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage("Status must be todo, in-progress, or completed."),
  body("priority")
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage("Priority must be low, medium, or high."),
  dueDateRule,
  validateRequest
];

const taskUpdateValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 120 })
    .withMessage("Title must be between 1 and 120 characters."),
  descriptionRule,
  body("status")
    .optional()
    .isIn(TASK_STATUSES)
    .withMessage("Status must be todo, in-progress, or completed."),
  body("priority")
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage("Priority must be low, medium, or high."),
  dueDateRule,
  validateRequest
];

const taskQueryValidation = [
  query("search")
    .optional()
    .trim()
    .isLength({ max: 120 })
    .withMessage("Search query is too long."),
  query("status")
    .optional()
    .isIn(["all", ...TASK_STATUSES])
    .withMessage("Invalid status filter."),
  query("priority")
    .optional()
    .isIn(["all", ...TASK_PRIORITIES])
    .withMessage("Invalid priority filter."),
  query("sort")
    .optional()
    .isIn(["newest", "oldest", "dueDate", "priority", "status"])
    .withMessage("Invalid sort option."),
  validateRequest
];

const taskIdParamValidation = [
  param("id").isMongoId().withMessage("Task id must be a valid id."),
  validateRequest
];

module.exports = {
  taskValidation,
  taskUpdateValidation,
  taskQueryValidation,
  taskIdParamValidation
};
