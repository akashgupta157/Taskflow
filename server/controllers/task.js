const taskModel = require("../models/task");

const createTask = async (req, res) => {
  try {
    const task = await taskModel.create({
      ...req.body,
      project: req.params.projectId,
      createdBy: req.userId,
    });
    console.log(task);
    res.status(201).json(task);
  } catch (error) {
    console.log(error.message);
  }
};

const getTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { assignedTo, sortBy } = req.query;

    let filter = { project: projectId };

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    let sortOptions = {};

    switch (sortBy) {
      case "priority":
        sortOptions.priority = 1;
        break;
      case "status":
        sortOptions.status = 1;
        break;
      case "createdAt":
        sortOptions.createdAt = -1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const tasks = await taskModel
      .find(filter)
      .populate("assignedTo", "name email")
      .sort(sortOptions);
    res.json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get tasks", error: err.message });
  }
};

const updateTask = async (req, res) => {
  const task = await taskModel.findById(req.params.taskId);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }
  if (task.assignedTo.toString() === req.userId) {
    task.status = req.body.status;
  } else {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }
  await task.save();
  await task.populate("assignedTo", "name email");
  res.json(task);
};

module.exports = {
  createTask,
  getTask,
  updateTask,
};
