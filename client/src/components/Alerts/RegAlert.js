import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegAlert(props) {
  let navigate = useNavigate();
  const [show, setShow] = useState(false);

  function handleRegister(event) {
    console.log("lol");
    const room = props.room;
    // Close the alert box
    Axios.post(
      "http://localhost:2000/api/registerRoom",
      {
        room: room,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    ).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert(`Successfully registered to ${room}`);
        navigate(0);
      }
    });
  }

  return (
    <>
      <Alert
        show={show}
        onClose={() => setShow(false)}
        variant="info"
        dismissible
      >
        <Alert.Heading>Register</Alert.Heading>
        <p style={{ textAlign: "justify" }}>
          Confirm registration? &#8377;{props.cost} will be deducted from your
          advances.
        </p>
        <hr />
        <div className="justify-content-end">
          <Button onClick={handleRegister} variant="outline-primary">
            Confirm
          </Button>
        </div>
      </Alert>

      {!show && <Button onClick={() => setShow(true)}>Register</Button>}
    </>
  );
}
