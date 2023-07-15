const express = require("express");
const router = express();
const {
  Register,
  validationSchemaForRegister,
  Login,
  Profile,
} = require("../controllers/user");

const auth = require("../middleware/auth");

router.route("/register").post(validationSchemaForRegister, Register);
router.route("/login").post(Login);
router.route("/profile").get(auth, Profile);

module.exports = router;
