import  { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import axios from "axios";

import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");
// const socket = io.connect("http://localhost:8080");

export default function Header() {
  const [info, setInfo] = useState("");
  const [notification, setNotification] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const configuration = {
      method: "get",
      url: "http://localhost:8080/api/v1/user/profile",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(configuration)
      .then((result) => {
        setInfo(result.data.user.username);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, setInfo]);

  useEffect(() => {
    socket.on("addProductResponse", (data) => {
      setNotification(
        `@${info} just added a new product ${data.result.productName}`
      );
    });
  }, [info]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Auction Valley</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end" style={{ width: "100%" }}>
            {info ? (
              <>
                <Nav.Link>
                  <Link
                    to="/addProduct"
                    style={{ textDecoration: "none", color: "black" }}>
                    Add Product
                  </Link>
                </Nav.Link>

                <Navbar.Text
                  style={{
                    textDecoration: "none",
                    color: "black",
                    marginRight: "1rem",
                    marginLeft: "1rem",
                  }}>
                  {info}
                </Navbar.Text>

                <Navbar.Text
                  style={{
                    textDecoration: "none",
                    color: "black",
                    marginRight: "1rem",
                    marginLeft: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={logout}>
                  Logout
                </Navbar.Text>
                <Navbar.Text style={{ color: "red" }}>
                  {notification}
                </Navbar.Text>
              </>
            ) : (
              <>
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
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
