const {
  getAllProjects,
  createProject,
  getProjectById,
} = require("../controllers/project");
const router = require("express").Router();

router.get("/", getAllProjects);
router.get("/:projectId", getProjectById);
router.post("/", createProject);

module.exports = router;
