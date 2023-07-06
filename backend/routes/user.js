const express = require("express");
const router = express();
const {
  Register,
  validationSchemaForRegister,
  Login,
} = require("../controllers/user");

router.route("/register").post(validationSchemaForRegister, Register);
router.route("/login").post(Login);
module.exports = router;
