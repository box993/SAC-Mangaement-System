import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./CheckInForm.css";
import { capitalize } from "lodash";
import Axios from "axios";

export default function EditPersonLimitForm(props) {
  const [personLimit, setPersonLimit] = useState("");

  function validateForm() {
    return personLimit.length > 0;
  }

  function handleSubmit(event) {
    Axios.post(
      "http://localhost:2000/api/editPersonLimit",
      {
        personLimit: personLimit,
        room: props.room,
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
        alert(`Person limit of ${props.room} updated to ${personLimit}`);
        setPersonLimit("");
      }
    });
    event.preventDefault();
  }

  return (
    <div className="Login">
      <h2 className="roomTitle">{capitalize(props.room)}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="personLimit">
          <Form.Label>New Person Limit: </Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={personLimit}
            onChange={(e) => setPersonLimit(e.target.value)}
          />
        </Form.Group>
        <Button
          style={{ marginTop: "4%" }}
          block
          size="lg"
          type="submit"
          disabled={!validateForm()}
        >
          Edit
        </Button>
      </Form>
    </div>
  );
}
