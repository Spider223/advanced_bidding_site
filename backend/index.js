const express = require("express");
const app = express();
require("dotenv").config();
const dbConnect = require("./DB/dbConnect");
const cors = require("cors");
const user = require("./routes/user");
const product = require("./routes/product");

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(cors());
app.use(express.json());
app.use("/api/v1/user", user);
app.use("/api/v1/product", product);
// app.use("/api/v1/product/addProduct", (req, res) => {
//   res.send("hello from add product");
// });

dbConnect;

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
