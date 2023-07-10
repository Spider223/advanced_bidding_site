const express = require("express");
const router = express();

const { addProduct } = require("../controllers/product");

router.route("/addProduct").post(addProduct);

module.exports = router;
