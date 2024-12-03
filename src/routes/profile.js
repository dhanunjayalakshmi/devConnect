const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;

    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const emailId = req?.body?.emailId;

  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    await User.findOneAndUpdate({ emailId: emailId }, req?.body);
    res?.json({ message: "User Info updated successfully" });
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

profileRouter.delete("/profile/delete", userAuth, async (req, res) => {
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

module.exports = profileRouter;
