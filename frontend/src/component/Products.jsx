import React from "react";
import { Button, Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Products({ productName, cover, description, _id }) {
  // console.log("hello", allProduct);
  return (
    <Col md="auto">
      <Card style={{ width: "18rem", margin: "12px 10px" }}>
        <Card.Img variant="top" src={"http://localhost:8080/" + cover} />
        <Card.Body>
          <Card.Title>{productName}</Card.Title>
          <Card.Text>{description}</Card.Text>
          <Link to={`singleProduct/${_id}`}>
            <Button variant="primary">Click to bid</Button>
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}
