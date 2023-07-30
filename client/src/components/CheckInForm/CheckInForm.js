import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./CheckInForm.css";
import Axios from "axios";

export default function CheckInForm(props) {
  const [bitsID, setBitsID] = useState("");

  function validateForm() {
    return bitsID.length > 0;
  }

  function handleSubmit(event) {
    Axios.post(
      `http://localhost:2000/api/${props.action}`,
      {
        bitsID: bitsID,
        room: props.room,
      },
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    ).then((response) => {
      console.log(response);
      if (response.data.error) {
        alert(response.data.error);
      } else {
        // console.log(response.data);
        alert("Success!");
      }
    });
    // event.preventDefault();
    // If I remove preventDefault, I don't get alerts
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="bitsID">
          <Form.Label>BITS ID: </Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={bitsID}
            onChange={(e) => setBitsID(e.target.value)}
          />
        </Form.Group>
        <Button
          style={{ marginTop: "4%" }}
          block
          size="lg"
          type="submit"
          disabled={!validateForm()}
        >
          {props.button}
        </Button>
      </Form>
    </div>
  );
}
