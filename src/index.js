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
  socket.on("send-appointment-data", ({ appointmentId, socketId }) => {
    if (appointments[appointmentId]?.length) {
      appointments[appointmentId].push(socketId);
    } else {
      appointments[appointmentId] = [socketId];
    }
    io.emit("appointment-data", appointments);
  });

  io.emit("number-of-users", io.engine.clientsCount);

  socket.on("disconnecting", function () {
    const socketId = socket.rooms.values().next().value; // NOTE: socket.rooms. is a Set
    appointments = removeSocketId(appointments, socketId);
    io.emit("appointment-data", appointments);
  });
});

/********************* code for serving static files **********************/
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
