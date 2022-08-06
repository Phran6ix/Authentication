const express = require("express");
const User = require("../model/userModel");

exports.getUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    message: "success",
    data: {
      users,
    },
  });
};
