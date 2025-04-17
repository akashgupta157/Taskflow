const projectModel = require("../models/project");

const getAllProjects = async (req, res) => {
  const projects = await projectModel
    .find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
  res.json(projects);
};

const getProjectById = async (req, res) => {
  const { projectId } = req.params;
  const project = await projectModel
    .findById(projectId)
    .populate("createdBy", "name email");
  res.json(project);
};

const createProject = async (req, res) => {
  const { name, description } = req.body;
  const project = await projectModel.create({
    name,
    description,
    createdBy: req.userId,
  });
  await project.populate("createdBy", "name email");
  res.status(201).json(project);
};

module.exports = { getAllProjects, getProjectById, createProject };
