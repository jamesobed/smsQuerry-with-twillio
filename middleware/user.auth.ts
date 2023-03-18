import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { userInstance } from "../models/user.model";

const isLoggedin = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.send("no authorization found");
    }
    const accessToken = authorization.split(" ")[1];
    const payload = await jwt.verify(
      accessToken,
      process.env.JWT_SECRET_ACCESSTOKEN!
    );

    const { id } = payload as any;

    if (!id) {
      return res.send("invalid token provided ");
    }
    const user = await userInstance.findById(id);
    if (!user) {
      return res.send("user not registered on database");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.send("token expired");
    }
    res.status(500).send("serve error");
  }
};

export default isLoggedin;
