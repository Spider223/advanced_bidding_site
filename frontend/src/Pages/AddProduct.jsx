import React, { useState } from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import axios from "axios";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState();

  const handleSubmit = () => {
    const data = {
      productName,
      description,
      basePrice,
      duration,
      category,
    };

    axios
      .post("http://localhost:8080/api/v1/product/addProduct", data)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container style={{ marginTop: "3rem" }}>
      <Form style={{ width: "50%" }} onSubmit={handleSubmit}>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalProductName">
          <Form.Label column sm={2}>
            ProductName
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Product Name"
              name="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="exampleForm.ControlTextarea1">
          <Form.Label column sm={2}>
            Description
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalProductDescription">
          <Form.Label column sm={2}>
            Base Price
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Base Price"
              name="basePrice"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalProductDescription">
          <Form.Label column sm={2}>
            Duration
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Duration in sec"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalProductDescription">
          <Form.Label column sm={2}>
            Category
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Electronics, Sports, Vehicles...."
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formFile" className="mb-3">
          <Form.Label column sm={2}>
            Upload Image
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="file"
              value={file}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Col>
        </Form.Group>
        <Button type="submit">ADD</Button>
      </Form>
    </Container>
  );
}