import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

let socket;

export const CurrentUsers = (props) => {
  const [members, setMembers] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [otherUsers, setOthersUsers] = useState({});
  const { appointmentId } = useParams();
  // console.log("props", props);
  console.log("===============================================");

  useEffect(() => {
    socket = io("http://localhost:4000");
    console.log("socket", socket);
  }, []);

  useEffect(() => {
    if (socket.disconnected) {
      socket = io("http://localhost:4000");
    }

    setTimeout(() => {
      socket.emit("custom-event", "Kingsley Ankomah", socket.id);

      socket.emit("send-appointment-data", {
        appointmentId,
        socketId: socket.id,
      });

      socket.on("number-of-users", (numOfUsers) => {
        console.log("SET PAGE MEMBERS LISTENER1");
        setNumberOfUsers(numOfUsers);
      });

      socket.on("appointment-data", (data) => {
        console.log("data => ", data);
        setOthersUsers(data);
      });
    }, 500);

    return () => {
      console.log(
        "============================================socket disconnected2"
      );
      socket.disconnect();
    };
  }, [setNumberOfUsers, appointmentId]);

  useEffect(() => {
    console.log("SET PAGE MEMBERS LISTENER2");
    socket.on("page-members", (id) => {
      setMembers((list) => [...list, id]);
    });
    return () => {
      console.log(
        "============================================socket disconnected"
      );
      socket.disconnect();
    };
  }, [setMembers]);

  return (
    <div className="App">
      <h1>Socket ids</h1>
      {otherUsers[appointmentId]?.length > 1 && (
        <h2>This appointment is currently being worked on!</h2>
      )}
      {/* {numberOfUsers > 1 && (
        <h2>This appointment is currently being worked on!</h2>
      )} */}
      <h3>{`Number of users: ${otherUsers[appointmentId]?.length}`}</h3>
      {/* <h3>{`Number of users: ${numberOfUsers}`}</h3> */}
      <ul>
        {members.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
};
