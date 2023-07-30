import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import AdminHeader from "../components/Headers/AdminHeader";
import Axios from "axios";
import { useParams } from "react-router-dom";

export default function AdminProfile(props) {
  const { room } = useParams();
  const dummyProfile = [
    {
      id: "lol",
      fName: "lol",
      lName: "lol",
      DOB: "0000-00-00",
      phoneNumber: "1212121212",
    },
    {
      id: "lol",
      fName: "lol",
      lName: "lol",
      DOB: "0000-00-00",
      phoneNumber: "3434343434",
    },
    {
      id: "lol",
      fName: "lol",
      lName: "lol",
      DOB: "0000-00-00",
      phoneNumber: "5656565656",
    },
  ];

  const [profile, setProfile] = useState(dummyProfile);

  useEffect(() => {
    Axios.get("http://localhost:2000/api/adminprofile", {
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    }).then((response) => {
      setProfile(response.data);
    });
  }, []);

  const d = new Date(profile[0].DOB).toLocaleDateString();

  return (
    <div>
      <AdminHeader room={room} />
      <Card className="profileObject">
        <Card.Body>
          <Card.Title>Admin Profile</Card.Title>
          <br />
          <Card.Text>ID: {profile[0].id}</Card.Text>
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
