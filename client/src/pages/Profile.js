import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import StudentHeader from "../components/Headers/StudentHeader";
import Axios from "axios";

export default function Profile() {
  const dummyProfile = [
    {
      bitsmail: "lol",
      fName: "lol",
      lName: "lol",
      DOB: "0000-00-00",
      phoneNumber: "1212121212",
    },
    {
      bitsmail: "lol",
      fName: "lol",
      lName: "lol",
      DOB: "0000-00-00",
      phoneNumber: "3434343434",
    },
    {
      bitsmail: "lol",
      fName: "lol",
      lName: "lol",
      DOB: "0000-00-00",
      phoneNumber: "5656565656",
    },
  ];

  const [profile, setProfile] = useState(dummyProfile);

  useEffect(() => {
    Axios.get("http://localhost:2000/api/profile", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      // console.log(response.data);
      setProfile(response.data);
    });
  }, []);

  const d = new Date(profile[0].DOB).toLocaleDateString();

  return (
    <div>
      <StudentHeader />
      <Card className="profileObject">
        <Card.Body>
          <Card.Title>Profile</Card.Title>
          <br />
          <Card.Text>Email: {profile[0].bitsmail}</Card.Text>
          <Card.Text>First Name: {profile[0].fName}</Card.Text>
          <Card.Text>Last Name: {profile[0].lName}</Card.Text>
          <Card.Text>DOB: {d}</Card.Text>
          <Card.Text>Address: {profile[0].Address}</Card.Text>
          <Card.Text>
            Phone Numbers:
            {profile.map((item) => (
              <p>{item.phoneNumber}</p>
            ))}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
