// Card for student only shows register button for applicable rooms

import React from "react";
import Card from "react-bootstrap/Card";
import RegAlert from "../Alerts/RegAlert";

export default function RoomCard(props) {
  return (
    <Card style={{ width: "18rem" }} className="studentCardObject">
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <br />
        {/* <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle> */}
        {/* <Card.Text className="description">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text> */}
        <Card.Text>Current: {props.current}</Card.Text>
        <Card.Text>Capacity: {props.capacity}</Card.Text>
        {props.registrationReq ? (
          props.registered ? (
            <Card.Subtitle>Already Registered!</Card.Subtitle>
          ) : (
            <RegAlert cost={props.cost} room={props.name} />
          )
        ) : null}
      </Card.Body>
    </Card>
  );
}
