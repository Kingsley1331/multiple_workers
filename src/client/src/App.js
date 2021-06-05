import { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { CurrentUsers } from "./components/CurrentUsers";

const socket = io("http://localhost:4000");

export default function BasicExample() {
  const appointmentIds = ["121", "122", "123", "124", "125"];
  const [occupiedIds, setOccupiedIds] = useState([]);

  socket.on("connect", () => {
    socket.on("appointment-data", (data) => {
      const currentIds = [];
      for (let id in data) {
        if (data[id].length) {
          currentIds.push(id);
        }
      }
      console.log("currentIds", currentIds);
      setOccupiedIds(currentIds);
    });
  });

  return (
    <Router>
      <div>
        <ul style={{ listStyleType: "none" }}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {appointmentIds.map((id, idx) => {
            const isAppointmentOccupied = occupiedIds.some(
              (appId) => appId === id
            );
            const color = isAppointmentOccupied ? "red" : "black";
            return (
              <li>
                <Link
                  style={{ color }}
                  to={`/appointment/${id}`}
                >{`Appointment ${idx + 1}`}</Link>
              </li>
            );
          })}
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <div className="App">
              <Home />
            </div>
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/appointment/:appointmentId" component={CurrentUsers} />
        </Switch>
      </div>
    </Router>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}
function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}
