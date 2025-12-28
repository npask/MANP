const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

let players = {};

/* Roblox Positions */
app.post("/positions", (req, res) => {
  req.body.players?.forEach(p => {
    players[p.userId] = { ...p, lastSeen: Date.now() };
  });
  res.sendStatus(200);
});

app.get("/players", (_, res) => res.json(players));

app.use(express.static("public"));

/* Voice */
io.on("connection", socket => {
  console.log("Voice client 🎧", socket.id);

  socket.on("join", userId => {
    socket.userId = userId;
  });

  socket.on("voice", data => {
    // data: { from, audio }
    console.log("tramsmitting from: " + data.from)
    socket.broadcast.emit("voice", data);
  });

  socket.on("disconnect", () => {
    console.log("Client weg 💀");
  });
});

server.listen(3000, () => {
  console.log("Server läuft auf 3000 🚀");
});

