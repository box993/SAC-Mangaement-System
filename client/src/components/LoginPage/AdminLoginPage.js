import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./LoginPage.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  let navigate = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [room, setRoom] = useState("");

  function validateForm() {
    return id.length > 0 && password.length > 0 && room.length > 0;
  }

  function handleSubmit(event) {
    Axios.post("http://localhost:2000/api/adminlogin", {
      id: id,
      password: password,
      room: room,
    }).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        console.log("token stored");
        navigate(`../admindash/${response.data.room}`);
      }
    });
    event.preventDefault();
  }

  return (
    <div className="Login">
      <h2 style={{ marginBottom: "2%", textAlign: "center" }}>Admin Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>ID: </Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="room">
          <Form.Label>Room: </Form.Label>
          <Form.Control
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </Form.Group>
        <Button
          style={{ marginTop: "4%" }}
          block
          size="lg"
          type="submit"
          disabled={!validateForm()}
        >
          Login
        </Button>
      </Form>
    </div>
  );
}
