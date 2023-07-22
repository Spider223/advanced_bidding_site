import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import io from "socket.io-client";
// import Timer from "../component/Timer";
import { useAuthStore } from "./store";
const socket = io.connect("http://localhost:8080");

export default function SingleProduct() {
  const { id } = useParams();
  // store
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const [singleProduct, setSingleProduct] = useState([]);
  const [userInput, setUserInput] = useState();
  const [info, setInfo] = useState("");
  const [currentBidder, setCurrentBidder] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [basePriceError, setBasePriceError] = useState(false);
  const [currentPriceError, setCurrentPriceError] = useState(false);
  const [startBiding, setStartBiding] = useState(false);
  const [timeUp, setTimeUp] = useState(10); // duration
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
        setInfo(result.data.user.username);
        setUser(result.data.user.username);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const placeBid = (e) => {
    e.preventDefault();
    console.log(userInput);
    console.log(singleProduct.basePrice);

    if (
      userInput > Number(singleProduct.basePrice) &&
      userInput > Number(currentPrice)
    ) {
      socket.emit("bidProduct", {
        userInput,
        last_bidder: singleProduct.username.username,
        info,
        duration: singleProduct.duration,
        id: singleProduct._id,
      });
      setBasePriceError(false);
      setCurrentPriceError(false);
    }
    if (userInput < Number(singleProduct.basePrice)) {
      setBasePriceError(true);
    } else if (userInput < Number(currentPrice)) {
      setCurrentPriceError(true);
    }
  };

  useEffect(() => {
    socket.on("updatedProduct", (data) => {
      const { currentPrice, lastBidder } = data;
      setCurrentBidder(lastBidder);
      setCurrentPrice(currentPrice);
    });
  }, []);
  const startBid = () => {
    socket.emit("start-bid", true);
  };
  useEffect(() => {
    socket.on("starting", (data) => {
      setStartBiding(data);
    });
  }, [setStartBiding]);
  useEffect(() => {
    if (startBiding) {
      let intervalTimer = setInterval(async () => {
        setTimeUp((prev) => (prev <= 0 ? 0 : prev - 1));
      }, 1000);
      setTimeout(() => {
        clearInterval(intervalTimer);
      }, 120000); // duration*1000
    }
  }, [startBiding]);

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
          <h6>Time Remaining : {timeUp <= 0 ? "Bidding ended" : timeUp} </h6>
          <h6>Current Price : {currentPrice} </h6>
          <h6>Current Bidder :{currentBidder} </h6>
          <hr />
          <div style={{ gap: "4px" }}>
            <form onSubmit={placeBid}>
              {basePriceError ? (
                <p style={{ color: "red" }}>
                  The bidding amount must be greater than{" "}
                  {singleProduct.basePrice}
                </p>
              ) : (
                ""
              )}
              {currentPriceError ? (
                <p style={{ color: "red" }}>
                  The bidding amount must be greater than {currentPrice}
                </p>
              ) : (
                ""
              )}

              {/* {checkPriceError()} */}

              {/* <Timer duration={singleProduct?.duration} /> */}
              {user === singleProduct.username?.username ? (
                <button type="submit" onClick={() => startBid()}>
                  Start bid
                </button>
              ) : (
                <>
                  {timeUp <= 0 ? (
                    <>
                      <input
                        placeholder="$"
                        type="number"
                        value={userInput}
                        disabled
                        onChange={(e) => setUserInput(e.target.value)}
                      />
                      <button type="submit" disabled>
                        Place bid
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        placeholder="$"
                        type="number"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                      />
                      <button type="submit">Place bid</button>
                    </>
                  )}
                </>
              )}
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
