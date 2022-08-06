const express = require("express");
const { promisify } = require("util");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// Login user
exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    role: req.body.role,
    password: req.body.password,
    confirmPassword: req.body.password,
  });

  token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
  newUser.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
};

exports.login = async (req, res, next) => {
  //check for bad request
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array });

  // destructure the req body and check if user exist
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.checkPassword(password, user.password)))
      return res.status(404).json({
        statusCode: 404,
        message: "Email or Password is incorrect",
      });

    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    user.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    console.error(err);
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Authorization denied",
    });
  }
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decode);

  const currentUser = await User.findById(decode.id);

  if (!currentUser) {
    return next(new Error("User not found"));
  }
  req.user = currentUser;
  next();
};
