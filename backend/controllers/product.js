const Product = require("../model/Product");

const addProduct = async (req, res) => {
  //   const { originalname, path } = req.file;

  //   const parts = originalname.split(".");
  //   const ext = parts[parts.length - 1];
  //   const newPath = path + "." + ext;
  //   fs.renameSync(path, newPath);

  const { productName, description, basePrice, duration, category } = req.body;

  const createPost = await Product.create({
    productName,
    description,
    basePrice,
    duration,
    category,
  });

  res.status(201).json({ createPost });
};

module.exports = { addProduct };
