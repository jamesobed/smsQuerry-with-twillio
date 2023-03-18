import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { userInstance } from "../models/user.model";

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
    const user = await userInstance.findOne({ email });
    if (!user) {
      return res.status(401).send("user not registered");
    }
    const id = user._id;
    let refreshToken = "",
      AccessToken = "";
    refreshToken = jwt.sign({ id }, process.env.JWT_SECRET!);
    AccessToken = jwt.sign({ id }, process.env.JWT_SECRET_ACCESS!, {
      expiresIn: "30s",
    });
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({ AccessToken, refreshToken });
  } catch (error) {}
});

router.post("/regenerate_access_token", async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.send("please provide a refresh token");
    }
    const user = await userInstance.findOne({ refreshToken });
    if (!user) {
      return res.send("invalid refresh token");
    }
    const id = user._id;
    const AccessToken = jwt.sign({ id }, process.env.JWT_SECRET_ACCESS!, {
      expiresIn: "30s",
    });
    return res.send(AccessToken);
  } catch (error) {
    return res.send("server error fail to regenerate access token");
  }
});

router.post("/logout", async (req, res) => {
  try {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      return res.send("please provide a refesh token");
    }
    let user = await userInstance.findOne({ refreshToken });
    if (!user) {
      return res.send("Invalid token provided");
    }
    user.refreshToken = "";
    await user.save();
    return res.send("You have successfully logged out");
  } catch (error) {
    return res.send('failled to logout. Server error')
  }
});

export default router;
