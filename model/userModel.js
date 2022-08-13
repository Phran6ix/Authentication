const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validate = require("validate");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true, "Input your firstName"],
  },
  lastName: {
    type: String,
    require: [true, "Input your lastName"],
  },
  email: {
    type: String,
    require: [true, "Input your email"],
  },
  username: {
    type: String,
    require: [true, " Please input your Username"],
  },
  role: {
    type: String,
    enum: ["admin", "user", "staff", "managers"],
    default: "user",
  },
  password: {
    type: String,
    require: [true, "Please input your password"],
  },
  confirmPassword: {
    type: String,
    require: [true, "confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
