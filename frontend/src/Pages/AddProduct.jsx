import { useState } from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import axios from "axios";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8080");

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("basePrice", basePrice);
    formData.append("duration", duration);
    formData.append("category", category);
    formData.append("file", file);

    // const data = {
    //   productName,
    //   description,
    //   basePrice,
    //   duration,
    //   category,
    //   file,
    // };
    const token = localStorage.getItem("token");

    const authorization = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // await axios
    //   .post(
    //     "http://localhost:8080/api/v1/product/addProduct",
    //     formData,
    //     authorization
    //   )
    //   .then((result) => {
    //     window.location.href = "/";
    //     socket.emit("addProduct", {
    //       result: result.data,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/product/addProduct",
        formData,
        authorization
      );
      window.location.href = "/";
      socket.emit("addProduct", {
        result: response.data,
      });
    } catch (error) {
      console.log(error);
    }

    // alert("hello");
  };

  return (
    <Container style={{ marginTop: "3rem" }}>
      <Form style={{ width: "50%" }} onSubmit={handleSubmit}>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalProductName"
        >
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
              required
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="exampleForm.ControlTextarea1"
        >
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
              required
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalProductDescription"
        >
          <Form.Label column sm={2}>
            Base Price
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              pattern="[0-9]*"
              placeholder="Base Price"
              name="basePrice"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalProductDescription"
        >
          <Form.Label column sm={2}>
            Duration
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              pattern="[0-9]*"
              placeholder="Duration in sec"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalProductDescription"
        >
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
              required
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
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Col>
        </Form.Group>
        <Button type="submit">ADD</Button>
      </Form>
    </Container>
  );
}
