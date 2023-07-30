import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./LoginPage.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  let navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    console.log("submitted");
    Axios.post("http://localhost:2000/api/login", {
      bitsmail: email,
      password: password,
    }).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data.token);
        navigate("../studentdash");
      }
    });
    event.preventDefault();
  }

  return (
    <div className="Login">
      <h2 style={{ marginTop: "-1%", marginBottom: "2%", textAlign: "center" }}>
        Login
      </h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>BITS ID: </Form.Label>
          <Form.Control
            autoFocus
            autoComplete="on"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
