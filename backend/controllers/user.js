const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const validationSchemaForRegister = [
  body("email", "Enter a valid email.").isEmail(),
  body("username", "Username must be atleast 4 characters.").isLength({
    min: 4,
  }),
  body("password", "Password must be atleast 6 characters.").isLength({
    min: 6,
  }),
];

const Register = async (req, res) => {
  const { username, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let userCheck = await User.findOne({ username } || { email });

  if (userCheck) {
    return res
      .status(400)
      .send({ message: "username or email already exists." });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });

      user
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).send({
            username: result.username,
            email: result.email,
            id: result._id,
          });
        })
        .catch((err) => {
          res.send({
            message: "Error creating user",
            Error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Password was not hashed.",
      });
      console.log(err);
    });
};

const Login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((result) => {
      bcrypt.compare(password, result.password, (err, data) => {
        if (err) throw err;

        const token = jwt.sign(
          {
            id: result._id,
            email: email,
            username: result.username,
          },
          "RANDOM-TOKEN"
        );

        if (data) {
          return res.status(200).send({
            message: "Login success",
            token,
          });
        } else {
          return res.status(401).send({
            message: "Invalid credentials",
          });
        }
      });
    })
    .catch((err) => {
      res.status(404).send({
        message: "user doesnot exist",
        err,
      });
    });
};

const Profile = (req, res) => {
  res.send({
    message: "you are authorized to access.",
    user: req.user,
  });
};

module.exports = { Register, validationSchemaForRegister, Login, Profile };
