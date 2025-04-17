const projectModel = require("../models/project");

module.exports = async (req, res, next) => {
  const createdBy = await projectModel
    .findById(req.params.projectId)
    .select("createdBy")
    .exec();
  if (!createdBy) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
    });
  }
  if (createdBy.createdBy.toString() !== req.userId) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to perform this action",
    });
  }
  next();
};
