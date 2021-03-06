import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

let socket;

export const CurrentUsers = () => {
  const [otherUsers, setOthersUsers] = useState({});
  const { appointmentId } = useParams();

  useEffect(() => {
    socket = io("http://localhost:4000");
  }, []);

  useEffect(() => {
    if (socket.disconnected) {
      socket = io("http://localhost:4000");
    }

    socket.on("connect", () => {
      socket.emit("send-appointment-data", {
        appointmentId,
        socketId: socket.id,
      });

      socket.on("appointment-data", (data) => {
        console.log("data => ", data);
        setOthersUsers(data);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [appointmentId]);

  return (
    <div className="App">
      <h5>{`Appointment ${appointmentId[2]}`}</h5>
      {otherUsers[appointmentId]?.length > 1 && <h2>Being worked on!</h2>}
      <h3>{`Number of users: ${otherUsers[appointmentId]?.length}`}</h3>
    </div>
  );
};
