const express = require("express");
const app = express();
require("dotenv").config();
const dbConnect = require("./DB/dbConnect");
const cors = require("cors");
const user = require("./routes/user");

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", user);

dbConnect;

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
