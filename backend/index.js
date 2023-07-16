const express = require("express");

const app = express();
require("dotenv").config();
const dbConnect = require("./DB/dbConnect");
const cors = require("cors");
const user = require("./routes/user");
const product = require("./routes/product");
const Product = require("./model/Product");

const port = process.env.PORT;

const http = require("http").Server(app);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(cors());

socketIO.on("connection", (socket) => {
  console.log(`${socket.id} user just connected`);
  socket.on("disconnect", () => {
    console.log(`${socket.id} user just disconnected.`);
  });

  socket.on("addProduct", (data) => {
    console.log(data);
    socket.broadcast.emit("addProductResponse", data);
  });

  socket.on("bidProduct", (data) => {
    console.log(data);
    const { userInput, last_bidder, info, id } = data;

    Product.findByIdAndUpdate(
      id,
      { currentPrice: userInput, lastBidder: info },
      { new: true }
    )
      .then((result) => {
        socket.broadcast.emit("updatedProduct", result);
        console.log(result);
      })
      .catch((err) => console.log(err));
  });
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(express.json());
app.use("/api/v1/user", user);
app.use("/api/v1/product", product);

app.use("/uploads", express.static(__dirname + "/uploads"));

dbConnect;

http.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
