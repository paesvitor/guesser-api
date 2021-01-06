import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import connect from "./connect";
import cors from "cors";

const app: Application = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

app.use(function (req, res, next) {
  req.io = io;
  next();
});

app.use(routes);

http.listen(port, () =>
  console.log(`Application started successfully on port ${port}.`)
);
const db = "mongodb://localhost:27017/guessr";
connect({ db });
