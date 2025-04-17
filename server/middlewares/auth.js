const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authorization token not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.email = decoded.user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: `Something went wrong in middleware: ${error.message}`,
    });
  }
};
