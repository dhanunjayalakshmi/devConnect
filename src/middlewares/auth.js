const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    const { token } = req?.cookies;

    if (!token) {
      return res.status(401).send("Please Login");
    }

    const user = await jwt.verify(token, process.env.SECRET_JWT_TOKEN);

    const { _id } = user;

    const loggedInUser = await User.findById(_id);

    if (!loggedInUser) {
      throw new Error("User not found");
    }

    req.user = loggedInUser;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
