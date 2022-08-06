const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes");

const app = express();

app.use(express.json());

app.use("/api/v1/auth", route);

module.exports = app;
