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

http.listen(3001, function () {
  console.log("Servidor rodando em: http://localhost:3001");
});
