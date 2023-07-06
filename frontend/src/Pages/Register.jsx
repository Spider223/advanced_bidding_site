import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState([]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      username: form.username,
      email: form.email,
      password: form.password,
    };

    axios
      .post("http://localhost:8080/api/v1/user/register", data)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
        // alert("Invalid credentials");

        const errors = err.response.data.errors;
        if (errors) {
          // alert(errors.map((err) => err.msg));
          setError(errors);
        }
      });
  };
  return (
    <Container>
      <h2 style={{ textAlign: "center", marginTop: "4rem" }}>Register</h2>
      <Form style={{ marginTop: "2rem" }} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
            <Form.Text className="text-muted" style={{ color: "red" }}>
              {error.map((err) => {
                return err.path === "email" ? err.msg : "";
              })}
            </Form.Text>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              placeholder="Enter Username"
              name="username"
              value={form.username}
              onChange={onChange}
              required
            />
            <Form.Text className="text-muted">
              {error.map((err) => {
                return err.path === "username" ? err.msg : "";
              })}
            </Form.Text>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              minLength={4}
            />
            <Form.Text className="text-muted">
              {error.map((err) => {
                return err.path === "password" ? err.msg : "";
              })}
            </Form.Text>
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
          <Form.Control placeholder="1234 Main St" />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>City</Form.Label>
            <Form.Control />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>State</Form.Label>
            <Form.Select defaultValue="Choose...">
              <option>Choose...</option>
              <option>...</option>
            </Form.Select>
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}
