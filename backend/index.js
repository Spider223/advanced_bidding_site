const express = require("express");

const app = express();
require("dotenv").config();
const dbConnect = require("./DB/dbConnect");
const cors = require("cors");
const user = require("./routes/user");
const product = require("./routes/product");
const Product = require("./model/Product");
// const Auction = require("./model/Auction");

const port = process.env.PORT || 5000;

app.use(express.json());

const http = require("http").Server(app);

const socketIO = require("socket.io")(http, {
  cors: {
    origin:["http://127.0.0.1:3000", "http://localhost:3000"],
    // origin: "http://localhost:3000",
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
    socketIO.emit("addProductResponse", data);
  });
  //  socket.on("bit-paced", ({bidder, price}) => {
  //   socketIO.emit("watch-bid", {bidder, price});
  // });
  socket.on("start-bid", ({ id }) => {
    Product.findByIdAndUpdate(
      { _id: id },
      { $inc: { remainingTime: -1 } },
      { new: true }
    )
      .then((data) => {
        if (data && data.remainingTime < 0) {
          data.remainingTime = 0;
          return data.save();
        }
        console.log("🚀 ~ file: index.js:43 ~ .1st ~ data:", data.remainingTime);
        return data;  
      })
      .then((data) => {
         console.log(
           "🚀 ~ file: index.js:43 ~ .2nd ~ data:",
           data.remainingTime
         );
        socketIO.emit("starting", data.remainingTime);
      })
      .catch((error) => console.log(error.message));
  });
  socket.on("bidProduct", async (data) => {
    const { userInput, last_bidder, info, id, duration } = data;

    let product = await Product.findById(id);
    product.remainingTime = product.duration;
    let durations = product.duration;
    let timer = product.remainingTime;
    let intervalTimer = setInterval(async () => {
      timer -= 1;
      if (timer <= 0) {
        return 0;
      }
      await product.updateOne({ remainingTime: timer }).then((result) => {
        socketIO.emit("timer", result);
      });
    }, 1000);

    // await product.updateOne({ remainingTime: name });

    setTimeout(async () => {
      clearInterval(intervalTimer);
    }, (durations + 1) * 1000);

    Product.findByIdAndUpdate(
      id,
      {
        currentPrice: userInput,
        lastBidder: info,
      },
      { new: true }
    )
      .then((result) => {
        socketIO.emit("updatedProduct", result);
        console.log(result);
      })
      .catch((err) => console.log(err));
  });
});

app.use("/api/v1/user", user);
app.use("/api/v1/product", product);

app.use("/uploads", express.static(__dirname + "/uploads"));

dbConnect;

http.listen(port, () => {
  console.log(`listening on port : ${port}`);
});
