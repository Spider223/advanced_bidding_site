const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  await mongoose
    .connect(process.env.MONGOURL)
    .then(() => {
      console.log("Connected to the mongodb database.");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = dbConnect();
