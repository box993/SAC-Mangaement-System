// This page shows the summary of each room
import React, { useState, useEffect } from "react";
import Header from "../components/Headers/Header";
import RoomCard from "../components/RoomCard/RoomCard";
import Row from "react-bootstrap/Row";
import Axios from "axios";

export default function Home() {
  // const rooms = [
  //   { Name: "Gym", Current: 10, Capacity: 30, registrationReq: true },
  //   { Name: "Badminton", Current: 8, Capacity: 8, registrationReq: false },
  //   { Name: "VM322", Current: 2, Capacity: 10, registrationReq: true },
  // ];

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:2000/api/home").then((response) => {
      setRooms(response.data);
      console.log(rooms);
    });
  }, []);

  return (
    <div>
      <Header />
      <div className="studentCards">
        <Row xs={1} md={2}>
          {rooms.map((room) => (
            <RoomCard
              key={room.RoomID}
              name={room.Name}
              current={room.Current}
              capacity={room.Capacity}
              registrationReq={false}
            />
          ))}
        </Row>
      </div>
    </div>
  );
}
