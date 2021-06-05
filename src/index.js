const { log } = require("console");
const express = require("express");

const io = require("socket.io")(4000, {
  cors: {
    origin: ["http://localhost:3002"],
  },
});

let appointments = {};

const removeSocketId = (appointmentIds, socketId) => {
  for (let id in appointmentIds) {
    const socketIds = appointmentIds[id];
    appointmentIds[id] = socketIds.filter((id) => id !== socketId);
  }
  return appointmentIds;
};

io.on("connection", (socket) => {
  console.log("socket id ==> ", socket.id);

  socket.on("custom-event", (name, id) => {
    console.log({ name, id });
    io.emit("page-members", id);

    const numOfUsers = io.engine.clientsCount;
    io.emit("number-of-users", numOfUsers);
    console.log("number-of-users", numOfUsers);
  });

  socket.on("send-appointment-data", ({ appointmentId, socketId }) => {
    console.log({ appointmentId, socketId });
    if (appointments[appointmentId]?.length) {
      appointments[appointmentId].push(socketId);
    } else {
      appointments[appointmentId] = [socketId];
    }
    io.emit("appointment-data", appointments);
  });

  io.emit("number-of-users", io.engine.clientsCount);

  socket.on("disconnecting", function () {
    console.log("=============================DISCONNECTING");
    const socketId = socket.rooms.values().next().value; // NOTE: socket.rooms. is a Set
    appointments = removeSocketId(appointments, socketId);
    console.log("appointments ", appointments);
    console.log("rooms", socketId);
    io.emit("appointment-data", appointments);
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
