const express = require("express");

const router = express.Router();
const { check } = require("express-validator");
const authController = require("./controller/authController");
const userController = require("./controller/userController");

router.get("/", authController.protect, userController.getUsers);
router.post("/signup", authController.signup);
router.post(
  "/login",
  [
    check("email", "please input a valid email").isEmail(),
    check("password", "input a valid password").exists(),
  ],
  authController.login
);

module.exports = router;
