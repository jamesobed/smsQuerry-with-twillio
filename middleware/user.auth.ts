import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { userInstance } from "../models/user.model";

const router = express.Router();

export const isLoggedIn = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).send("you are not logged in");
    }
    const accessToken = authorization.split(" ")[1];

    const payload = await jwt.verify(
      accessToken,
      process.env.JWT_SECRET_ACCESS!
    );
    let { id, exp } = payload as any;
    console.log(exp, Date.now());

    if (!payload) {
      return res.status(401).send("you are not logged in");
    }
    const user = await userInstance.findById(id);
    if (!user) {
      return res.status(401).send("you are not logged in");
    }
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send("token expired");
    }

    res.status(500).json({ message: "fail to verify user" });
  }
};

export default router;
