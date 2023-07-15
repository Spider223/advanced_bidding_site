import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import moment from "moment";
import io from "socket.io-client";

const socket = io.connect("http://localhost:8080");

export default function SingleProduct() {
  const { id } = useParams();

  const [singleProduct, setSingleProduct] = useState([]);
  const [userInput, setUserInput] = useState();
  const [info, setInfo] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/product/singlePost/${id}`)
      .then((result) => {
        console.log(result.data.singleProduct);
        setSingleProduct(result.data.singleProduct[0]);
        socket.emit("singleProduct", {
          productName: result.data.singleProduct[0].productName,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [socket]);

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
        console.log(result);
        setInfo(result.data.user.username);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const placeBid = (e) => {
    e.preventDefault();
    console.log(userInput);
    console.log(singleProduct.basePrice);

    if (userInput > Number(singleProduct.basePrice)) {
      socket.emit("bidProduct", {
        userInput,
        last_bidder: singleProduct.username.username,
        info,
      });
    } else {
      setError(true);
    }
  };

  return (
    <Container style={{ marginTop: "3rem" }}>
      <Row>
        <Col md={6}>
          <img
            src={"http://localhost:8080/" + singleProduct.cover}
            style={{ height: "100%", width: "100%", marginTop: "1rem" }}
          />
        </Col>
        <Col md={6}>
          <h3 style={{ textAlign: "center" }}>{singleProduct.productName}</h3>
          <h6>{singleProduct.description}</h6>
          <hr />
          <h3>Info</h3>
          <h6>Created On: {moment(singleProduct.createdAt).format("llll")}</h6>
          <h6>Created by: {singleProduct.username?.username}</h6>
          <h6>Base Price: Rs. {singleProduct.basePrice}</h6>
          <hr />
          <h3>Auction</h3>
          <h6>Time Remaining : </h6>
          <h6>Current Price : </h6>
          <h6>Current Bidder : </h6>
          <hr />
          <div style={{ gap: "4px" }}>
            <form onSubmit={placeBid}>
              {error ? (
                <p style={{ color: "red" }}>
                  The bidding amount must be greater than
                  {singleProduct.basePrice}
                </p>
              ) : (
                ""
              )}
              <input
                placeholder="$"
                type="number"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button type="submit">Place bid</button>
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
