const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await userModel.findOne({ email })) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: "Error hashing password",
        });
      }
      const user = await userModel.create({
        name,
        email,
        password: hash,
      });
      const token = jwt.sign(
        { userId: user._id, user: user.email },
        process.env.JWT_SECRET
      );
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          ...user._doc,
          token,
        },
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: `Error comparing password: ${err.message}`,
        });
      }
      if (!result) {
        return res.status(401).json({
          message: "Invalid password",
        });
      }
      const token = jwt.sign(
        { userId: user._id, user: user.email },
        process.env.JWT_SECRET
      );
      return res.status(200).json({
        message: "User logged in successfully",
        user: {
          ...user._doc,
          token,
        },
      });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const search = req.query.search
      ? {
          $or: [{ name: { $regex: req.query.search, $options: "i" } }],
        }
      : {};

    const users = await userModel
      .find({ ...search, _id: { $ne: req.userId } })
      .select("-password");

    res.send(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { register, login, searchUser };
