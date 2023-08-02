const Product = require("../model/Product");
const io = require("socket.io");

const socketServer = io();

const addProduct = async (req, res) => {
  const { productName, description, basePrice, duration, category } = req.body;
  const cover = req.file.path;

  // console.log(req.user.ID);
  const createPost = {
    productName,
    description,
    basePrice,
    duration,
    remainingTime: duration,
    category,
    username: req.user.id,
    cover: cover,
  };
  const newCreatePost = new Product(createPost);

  newCreatePost
    .save()
    .then((result) => {
      socketServer.emit("Product Created:");
      res.json(newCreatePost);
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
};

const getProduct = async (req, res) => {
  const getproduct = await Product.find();
  res.status(201).json({ getproduct });
};

const getSingleProduct = async (req, res) => {
  const { id: singleProductId } = req.params;
  const singleProduct = await Product.find({ _id: singleProductId }).populate(
    "username",
    ["username", "date"]
  );

  res.status(201).send({ singleProduct });
};
const startBid = (req, res) => {
  const id = req.params.id;
  Product.findByIdAndUpdate({ _id: id }, { $set: { auctionStarted: true } })
    .then((data) => {
      if (!data)
        return res
          .status(200)
          .json({ message: "auction could not start", status: 400 });
      return res.status(200).json({ message: "auction started", status: 200 });
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "something went wrong", status: 500 });
    });
};

const placeBid = (req, res) => {
  const id = req.params.id;
  Product.findByIdAndUpdate(
    { _id: id },
    { $set: { lastBidder: req.body.bidder, currentPrice: req.body.price } }
  )
    .then((data) => {
      if (!data)
        return res
          .status(200)
          .json({ message: "bid could not place", status: 400 });
      return res
        .status(200)
        .json({ message: "bid placed", status: 200, product: data });
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "something went wrong", status: 500 });
    });
};

module.exports = {
  addProduct,
  getProduct,
  getSingleProduct,
  socketServer,
  startBid,
  placeBid,
};
