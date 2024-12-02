const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const { userAuth } = require("./middlewares/auth");
const {
  validateSignupData,
  validateEditProfileData,
} = require("./utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/user", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;
    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (users?.length > 0) {
      res?.send(users);
    } else {
      res.send("There are no users");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  validateSignupData(req);
  const { firstName, lastName, emailId, password } = req?.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    emailId,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.json({ message: "User Info added successfully" });
  } catch (err) {
    res.status(400).send("Unable to save the user: " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req?.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const hashedPassword = user?.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (isPasswordValid) {
      const token = jwt.sign({ _id: user?._id }, process.env.SECRET_JWT_TOKEN, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.patch("/user", async (req, res) => {
  // const userId = req?.body?.userId;
  const emailId = req?.body?.emailId;

  try {
    // await User.findByIdAndUpdate(userId, req?.body);
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    await User.findOneAndUpdate({ emailId: emailId }, req?.body);
    res?.json({ message: "User Info updated successfully" });
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const emailId = req?.body?.emailId;
  try {
    const user = await User.findOneAndDelete({ emailId: emailId });

    if (user) {
      res?.send("User deleted successfully");
    } else {
      res.send("User not found");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection is established");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.log("Unable to connect to Database");
  });
