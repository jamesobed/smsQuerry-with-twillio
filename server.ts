import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

import userRouter from "./routes/user.routes";

const app = express();
const port = process.env.PORT || 3900;
const DB: any = process.env.DATABASE;

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/user", userRouter);

const UserArray: any = {};

app.get("/", (req, res) => {
  return res.json({
    msg: "Welcome to the Sowfte Technology and engineering!",
  });
});

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect(DB, {});
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log("Listening on port" + port + "!!!!!!!!");
  });
};

start();
