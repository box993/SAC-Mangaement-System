import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

export default function AdminHeader(props) {
  function handleClick() {
    localStorage.removeItem("accessToken");
  }
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to={`/admindash/${props.room}`}>
          SAC
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={`/admindash/${props.room}`}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to={`/admindash/${props.room}/history`}>
              History
            </Nav.Link>
            <Nav.Link as={Link} to={`/admindash/${props.room}/editPersonLimit`}>
              Edit Person Limit
            </Nav.Link>
            <Nav.Link as={Link} to={`/admindash/${props.room}/profile`}>
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/adminlogin">
              <button
                onClick={handleClick}
                style={{ borderStyle: "none", opacity: 0.6 }}
              >
                Logout
              </button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
