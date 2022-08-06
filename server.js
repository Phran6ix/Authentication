const mongoose = require("mongoose");
// con
// process.on("uncaughtException", (err) => {
//   console.log("unhadled rejection. shutting down....");
//   console.log(err.name, err.message);
//   process.exit(1);
// });
require("dotenv").config({ path: "./config.env" });

const database = (module.exports = () => {
  const connectionParam = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  };

  try {
    mongoose.connect("mongodb://localhost:27017", connectionParam);
    console.log("successful");
  } catch (err) {
    console.log("err");
  }
});

database();

const app = require("./app");
const port = process.env.PORT || 6000;

const server = app.listen(port, () => {
  console.log(`server connected at port ${port}`);
  // console.log(process.env);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhadled rejection. shutting down....");
  server.close(() => {
    process.exit(1);
  });
});
