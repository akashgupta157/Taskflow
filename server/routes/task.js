const { createTask, getTask, updateTask } = require("../controllers/task");
const role = require("../middlewares/role");
const router = require("express").Router();

router.post("/:projectId", role, createTask);
router.get("/:projectId", getTask);
router.patch("/:taskId", updateTask);

module.exports = router;
