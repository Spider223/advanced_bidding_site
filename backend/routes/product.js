const express = require("express");
const router = express();

const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const {
  addProduct,
  getProduct,
  getSingleProduct,
  startBid,
  placeBid,
} = require("../controllers/product");

const auth = require("../middleware/auth");

router
  .route("/addProduct")
  .post(auth, uploadMiddleware.single("file"), addProduct);

router.route("/getProduct").get(getProduct);

router.route("/singlePost/:id").get(getSingleProduct);
router.route("/start-bid/:id").get(startBid);
router.route("/place-bid/:id").post(placeBid);

module.exports = router;
