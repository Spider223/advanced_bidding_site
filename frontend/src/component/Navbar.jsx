import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Auction Valley</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link>
              <Link
                to="/addProduct"
                style={{ textDecoration: "none", color: "black" }}>
                Add Product
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "black" }}>
                Login
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "black" }}>
                Register
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
