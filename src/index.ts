import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router/index";
const app = express();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8000, () => {
  console.log("Server start on http://localhost:8000/");
});

const mongoUrl =
  "mongodb+srv://nahianhasan161:01717704948@cluster0.vdzvklr.mongodb.net/test";

mongoose.Promise = Promise;
mongoose.connect(mongoUrl);
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});

app.use("/", router());
