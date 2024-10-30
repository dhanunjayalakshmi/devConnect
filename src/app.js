const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.get("/user", async (req, res) => {
  const email = req?.body?.emailId;
  try {
    const user = await User.find({ emailId: email });
    if (user?.length > 0) {
      res?.send(user);
    } else {
      res.send("User not found");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
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
  const user = new User(req?.body);

  try {
    await user.save();
    res.send("User Info added successfully");
  } catch (err) {
    res.status(400).send("Unable to save the user: ", err.message);
  }
});

app.patch("/user", async (req, res) => {
  // const userId = req?.body?.userId;
  const emailId = req?.body?.emailId;

  try {
    // await User.findByIdAndUpdate(userId, req?.body);
    await User.findOneAndUpdate({ emailId: emailId }, req?.body);
    res?.send("User Info updated successfully");
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
