const { createComment, getComments } = require("../controllers/comment");
const router = require("express").Router();

router.post("/:taskId", createComment);
router.get("/:taskId", getComments);

module.exports = router;
