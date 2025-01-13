// controllers/adminController.js
const { Admin } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newAdmin = await Admin.create({ username, email, password });
    res
      .status(201)
      .json({ message: "Admin registered successfully", newAdmin });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const ispasswordValid = await bcrypt.compare(password, admin.password);
    if (!ispasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin.IdAdmin, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
