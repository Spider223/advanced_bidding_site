const mongoose = require("mongoose");
// require("mongoose-type-email");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    uniqure: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
