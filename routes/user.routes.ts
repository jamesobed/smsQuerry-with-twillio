import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { userInstance } from "../models/user.model";
import { sendSms } from "../services/smsControl";
import { isLoggedIn } from "../middleware/user.auth";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !phoneNumber || !password) {
      return res.status(401).send("please enter all the required input");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await userInstance.create({
      name,
      email,
      phoneNumber,
      password: hashPassword,
    });
    let message = "welcome to Sowfte";
    // await sendSms(phoneNumber, message);
    res.status(201).json({ message: "success", newUser });
  } catch (error) {
    res.status(500).json({ message: "fail to create user" });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send("please enter all the required input");
    }

    const user = await userInstance.findOne({ email });

    if (!user) {
      return res.send("This user is not registered");
    }
    const correct_password = await bcrypt.compare(password, user.password);

    if (!correct_password) {
      return res.send("invalid login credentials entered");
    }
    console.log("here");

    let payload = { id: user._id };

    const accessToken = await jwt.sign(
      payload,
      process.env.JWT_SECRET_ACCESS!,
      {
        expiresIn: "20s",
      }
    );
    const refreshToken = await jwt.sign(
      payload,
      process.env.JWT_SECRET_REFRESH!
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: "successfully logged in",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "fail to login user" });
  }
});

router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).send("please enter all the required input");
    }
    const user = await userInstance.findOne({ refreshToken });
    if (!user) {
      return res.status(401).send("invalid refresh token");
    }
    const payload = { id: user._id };
    const accessToken = await jwt.sign(
      payload,
      process.env.JWT_SECRET_ACCESS!,
      {
        expiresIn: "20s",
      }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "fail to refresh token" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).send("please enter all the required input");
    }
    const user = await userInstance.findOne({ refreshToken });
    if (!user) {
      return res.status(401).send("invalid refresh token");
    }
    user.refreshToken = "";
    await user.save();
    res.json({ message: "successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "fail to logout user" });
  }
});

router.get("/get-protected", isLoggedIn, async (req, res) => {
  try {
    res.send("welcome, you have access to protected route");
  } catch (error) {
    res.send("error");
  }
});

export default router;
