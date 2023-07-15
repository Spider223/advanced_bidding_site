const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("token is missing");
    }
    const decodedToken = jwt.verify(token, "RANDOM-TOKEN");

    const user = decodedToken;

    if (!user) {
      throw new Error("Invalid token payload");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "error creating token",
      error: new Error("invalid request"),
    });
  }
};

module.exports = auth;
