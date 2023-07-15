const Product = require("../model/Product");
const io = require("socket.io");

const socketServer = io();

const addProduct = async (req, res) => {
  console.log(req.body);

  const { productName, description, basePrice, duration, category } = req.body;
  const cover = req.file.path;

  // console.log(req.user.ID);
  const createPost = {
    productName,
    description,
    basePrice,
    duration,
    category,
    username: req.user.id,
    cover: cover,
  };

  const newCreatePost = new Product(createPost);

  newCreatePost
    .save()
    .then((result) => {
      socketServer.emit("Product Created:");
      res.json(result);
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
module.exports = { addProduct, getProduct, getSingleProduct, socketServer };
