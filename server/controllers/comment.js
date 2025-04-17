const commentModel = require("../models/comment");

const createComment = async (req, res) => {
  const comment = await commentModel.create({
    ...req.body,
    task: req.params.taskId,
    commentedBy: req.userId,
  });

  const populatedComment = await comment.populate("commentedBy", "name email");
  res.status(201).json(populatedComment);
};

const getComments = async (req, res) => {
  const comments = await commentModel
    .find({ task: req.params.taskId })
    .populate("commentedBy", "name email")
    .sort({ createdAt: -1 });
  res.json(comments);
};

module.exports = { createComment, getComments };
