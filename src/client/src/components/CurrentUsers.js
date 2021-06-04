import { useState, useEffect } from "react";
import { io } from "socket.io-client";

let socket;

export const CurrentUsers = () => {
  const [members, setMembers] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState(0);

  useEffect(() => {
    socket = io("http://localhost:4000");
    console.log("socket", socket);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (socket.disconnected) {
        socket = io("http://localhost:4000");
      }

      socket.emit("custom-event", "Kingsley Ankomah", socket.id);
      socket.on("number-of-users", (numOfUsers) => {
        console.log("SET PAGE MEMBERS LISTENER");
        setNumberOfUsers(numOfUsers);
      });
    }, 1000);
  }, [setNumberOfUsers]);

  useEffect(() => {
    console.log("SET PAGE MEMBERS LISTENER");
    socket.on("page-members", (id) => {
      setMembers((list) => [...list, id]);
    });
    return () => {
      socket.disconnect();
      console.log("socket disconnected");
    };
  }, [setMembers]);

  return (
    <div className="App">
      <h1>Socket ids</h1>
      {numberOfUsers > 1 && (
        <h2>This appointment is currently being worked on!</h2>
      )}
      <h3>{`Number of users: ${numberOfUsers}`}</h3>
      <ul>
        {members.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
};
