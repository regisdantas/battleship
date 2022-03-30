import dotEnv from "dotenv";
dotEnv.config();

import serverClass from "express";
const server = serverClass();
import httpClass from "http";
const http = httpClass.createServer(server);
import cors from "cors";

import * as socketClass from "socket.io";
const socket = new socketClass.Server(http, {
  transports: ["polling"],
  cors: {
    origin: "*",
  },
});

server.use(cors());

import gameClass from "./models/game-server.js";
const game = gameClass(socket);

server.get("/", function (req, res) {
  res.json({ message: "Hello World!" });
});

const port = process.env.PORT || 3001;
http.listen(port, function () {
  console.log(`Servidor rodando em: ${process.env.APP_URL}:${port}`);
});
