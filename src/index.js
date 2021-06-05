const express = require("express");

const io = require("socket.io")(4000, {
  cors: {
    origin: ["http://localhost:3002"],
  },
});

io.on("connection", (socket) => {
  console.log("socket id ==> ", socket.id);
  socket.on("custom-event", async (name, id, { room }) => {
    console.log({ name, id, room });
    socket.to(room).emit("page-members", id);
    const numOfUsers = io.engine.clientsCount;

    const roomies = await io.in(room).allSockets();

    socket.to(room).emit("number-of-users", roomies.size, room);
    // socket.to(room).emit("number-of-users", numOfUsers, room);
    console.log("number-of-users", numOfUsers);

    console.log("numOfRoomies", roomies.size);
    // console.log("number-of-room-users", numOfRoomUsers);
  });
  // socket.on("custom-event", (name, id, { room }) => {
  //   console.log({ name, id, room });
  //   io.emit("page-members", id);
  //   const numOfUsers = io.engine.clientsCount;
  //   io.emit("number-of-users", numOfUsers);
  //   console.log("number-of-users", numOfUsers);
  // });

  // io.emit("number-of-users", io.engine.clientsCount);

  socket.on("join-room", (room) => {
    socket.join(room);
  });

  socket.on("disconnecting", () => {
    console.log("disconnect rooms", socket.rooms);
  });

  socket.on("disconnect", function (connection) {
    console.log("connection => ", connection);

    const decrement = connection === "transport close" ? 0 : 1;
    const numOfUsers = io.engine.clientsCount - decrement;
    io.emit("number-of-users", numOfUsers);
    console.log("DISCONNECT number-of-users", numOfUsers);
  });
});

const app = express();
const path = require("path");

app.use(express.static("dist"));
app.use(express.static(path.join(__dirname, "client/build")));
const port = 4040;

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
