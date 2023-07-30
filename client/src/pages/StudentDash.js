import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentHeader from "../components/Headers/StudentHeader";
import RoomCard from "../components/RoomCard/RoomCard";

export default function StudentDash() {
  let navigate = useNavigate();
  // const rooms = [
  //   {
  //     name: "Gym",
  //     current: 10,
  //     capacity: 30,
  //     registrationReq: true,
  //     registered: true,
  //     cost: 700,
  //   },
  //   { name: "Badminton", current: 8, capacity: 8, registrationReq: false },
  //   {
  //     name: "VM322",
  //     current: 2,
  //     capacity: 10,
  //     registrationReq: true,
  //     registered: false,
  //     cost: 500,
  //   },
  // ];
  const dummyData = {
    name: "Gym",
    current: 0,
    capacity: 0,
    registrationReq: true,
    registered: true,
    cost: 0,
  };
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    console.log("into useEffect");
    Axios.get("http://localhost:2000/api/studentdash", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      // console.log("something");
      if (response.data.error) {
        console.log(response.data.error);
        // alert(response.data.error); // Why doesn't this give me the error which I set in middleware
        alert("Please log in");
        navigate("../login");
      } else {
        // console.log("yay");
        console.log(response);
        setRooms(response.data);
      }
    });
  }, []);

  return (
    <div>
      <StudentHeader />
      <div className="studentCards">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            name={room.name}
            current={room.current}
            capacity={room.capacity}
            registrationReq={room.cost > 0}
            registered={room.registered}
            cost={room.cost}
          />
        ))}
      </div>
    </div>
  );
}

// SELECT name,id,personLimit AS capacity,current,!ISNULL(bitsmail) AS registered FROM (SELECT name,rooms.roomid AS id,personlimit,COUNT(bitsmail) AS current FROM rooms LEFT JOIN users ON rooms.RoomID=users.roomID GROUP BY rooms.roomid) AS t LEFT JOIN registered ON t.id=registered.roomid AND registered.bitsmail='f20202059@hyderabad.bits-pilani.ac.in';
