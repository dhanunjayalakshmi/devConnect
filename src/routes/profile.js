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
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req?.user;
    Object.keys(req?.body).forEach(
      (key) => (loggedInUser[key] = req?.body[key])
    );
    await loggedInUser.save();
    res?.json({
      message: `${loggedInUser.firstName}, Your profile has been updated successfully.`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.delete("/profile/delete", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;
    await User.findByIdAndDelete(loggedInUser._id);
    res?.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res?.send("Your account is deleted. Thank you for your journey with us.");
  } catch (err) {
    res?.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
