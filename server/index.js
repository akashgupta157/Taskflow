require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./db");
const authRoute = require("./routes/auth");
const projectRoute = require("./routes/project");
const taskRoute = require("./routes/task");
const commentRoute = require("./routes/comment");
const authMiddleware = require("./middlewares/auth");
const cors = require("cors");
const { apiLimiter, authLimiter } = require("./middlewares/rateLimiter");

app.use(express.json());
app.use(cors());

// app.use("/auth", authLimiter);
// app.use("/", apiLimiter);

app.use("/auth", authRoute);
app.use("/project", authMiddleware, projectRoute);
app.use("/task", authMiddleware, taskRoute);
app.use("/comment", authMiddleware, commentRoute);

app.listen(3000, async () => {
  try {
    await connection();
    console.log(`Listening on port 3000`);
  } catch (error) {
    console.log(error);
  }
});
