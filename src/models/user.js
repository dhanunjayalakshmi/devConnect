const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String },
    emailId: {
      type: String,
      lowerCase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            value + " is not strong Please enter a strong password."
          );
        }
      },
    },
    gender: { type: String },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(value + " is an invalid photo URL");
        }
      },
    },
    about: {
      type: String,
      default: "Hello everyone. This is about me.",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
