require("dotenv").config();
const server = require("express")();
const http = require("http").createServer(server);
const cors = require("cors");

const socket = require("socket.io")(http, {
  transports: ["polling"],
  cors: {
    origin: "*",
  },
});

server.use(cors());

const game = require("./game")(socket);

server.get("/", function (req, res) {
  res.json({ message: "Hello World!" });
});

const port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log(`Servidor rodando em: ${process.env.APP_URL}:${port}`);
});
