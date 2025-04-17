const { register, login, searchUser } = require("../controllers/auth");
const auth = require("../middlewares/auth");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", auth, searchUser);

module.exports = router;
