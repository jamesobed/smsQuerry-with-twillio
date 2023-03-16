import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { userInstance } from "../models/user.model";
import { sendSms } from "../services/smsControl";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    const newUser = await userInstance.create({
      name,
      email,
      phoneNumber,
    });
    let message = "welcome to Sowfte";
    await sendSms(phoneNumber, message);
    res.status(201).json({ message: "success", newUser });
  } catch (error) {
    res.status(500).json({ message: "fail to create user" });
  }
});

export default router;
