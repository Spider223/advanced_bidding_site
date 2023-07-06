import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container } from "react-bootstrap";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      email: formData.email,
      password: formData.password,
    };

    axios
      .post("http://localhost:8080/api/v1/user/login", data)
      .then((result) => {
        console.log(result);
        alert("hello");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      <h2 style={{ textAlign: "center", marginTop: "10rem" }}>Login</h2>
      <Form
        style={{
          width: "50%",
          margin: "auto",
          display: "block",
        }}
        onSubmit={handleSubmit}>
        <Form.Group
          className="mb-3"
          controlId="formBasicEmail"
          onSubmit={handleSubmit}>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            style={{ borderColor: "rgb(37, 37, 211)" }}
            name="email"
            value={formData.email}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            style={{ borderColor: "rgb(37, 37, 211)" }}
            name="password"
            value={formData.password}
            onChange={onChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
