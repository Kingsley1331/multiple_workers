const express = require("express");

const io = require("socket.io")(4000, {
  cors: {
    origin: ["http://localhost:3002"],
  },
});

io.on("connection", (socket) => {
  console.log("socket id ==> ", socket.id);
  socket.on("custom-event", (name, id) => {
    console.log({ name, id });
    io.emit("page-members", id);
    // socket.broadcast.emit("page-activity", name);
    // console.log("number-of-users", io.engine.clientsCount);
    const numOfUsers = io.engine.clientsCount;
    io.emit("number-of-users", numOfUsers);
    console.log("number-of-users", numOfUsers);
    // io.emit("page-activity", name);
  });
  //   console.log("number-of-users", io.sockets);
  io.emit("number-of-users", io.engine.clientsCount);
  /** WORKS! */
  //   console.log("number-of-users", Object.keys(io.engine.clients));
  //   console.log("number-of-users", io.engine.clientsCount);
  //   console.log(
  //     "number-of-users",
  //     Object.keys(io.sockets.server.eio.clients).length
  //   );
  //   console.log("number-of-users", io.sockets.adapter.sids);
  socket.on("disconnect", function (connection) {
    console.log("connection => ", connection);
    const decrement = connection === "transport close" ? 0 : 1;
    //   socket.emit("disconnected");
    // const numOfUsers = Object.keys(io.engine.clients).length - 1;
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
