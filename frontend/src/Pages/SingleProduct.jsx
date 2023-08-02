import { useEffect, useState } from "react";
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
  const [userInput, setUserInput] = useState("");
  const [info, setInfo] = useState("");
  const [currentBidder, setCurrentBidder] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [basePriceError, setBasePriceError] = useState(false);
  const [currentPriceError, setCurrentPriceError] = useState(false);

  const [remainingTime, setRemainingTime] = useState("");
  const [bidStarted, setBidStarted] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/product/singlePost/${id}`)
      .then((result) => {
        setSingleProduct(result.data.singleProduct[0]);
        Number(setRemainingTime(result.data.singleProduct[0].remainingTime));
        setBidStarted(result.data?.singleProduct[0]?.auctionStarted);
        setCurrentBidder(result.data?.singleProduct[0]?.lastBidder);
        setCurrentPrice(result.data?.singleProduct[0]?.currentPrice);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [setSingleProduct, setBidStarted, id]);

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
  }, [setUser, token]);

  const placeBid = async (e) => {
    e.preventDefault();

    if (
      userInput > Number(singleProduct.basePrice) &&
      userInput > Number(currentPrice)
    ) {
      socket.emit("bit-paced", {
        bidder: info,
        price: userInput,
        id,
      });
    }
    if (userInput < Number(singleProduct.basePrice)) {
      setBasePriceError(true);
    } else {
      setBasePriceError(false);
    }
    if (userInput < Number(currentPrice)) {
      setCurrentPriceError(true);
    } else {
      setCurrentPriceError(false);
    }
  };

  const startBid = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `http://localhost:8080/api/v1/product/start-bid/${id}`
    );
    if (res.data.status === 200) {
      setBidStarted(true);
      let intervalTimer = setInterval(async () => {
        socket.emit("start-bid", { id });
      }, 1000);
      setTimeout(() => {
        clearInterval(intervalTimer);
      }, 120000);
    }
  };
  useEffect(() => {
    if (bidStarted)
      socket.on("starting", (data) => {
        Number(setRemainingTime(data));
      });
  }, [bidStarted]);

  useEffect(() => {
    const bidInterval = setInterval(async () => {
      if (bidStarted)
        axios
          .get(`http://localhost:8080/api/v1/product/singlePost/${id}`)
          .then((result) => {
            setCurrentBidder(result.data?.singleProduct[0]?.lastBidder);
            setCurrentPrice(result.data?.singleProduct[0]?.currentPrice);
          })
          .catch((err) => {
            console.log(err);
          });
    }, 1000);
    setTimeout(() => {
      clearInterval(bidInterval);
    }, 120000);
  }, [bidStarted, id]);
  return (
    <Container style={{ marginTop: "3rem" }}>
      <Row>
        <Col md={6}>
          <img
            src={"http://localhost:8080/" + singleProduct.cover}
            style={{
              height: "25em",
              width: "25em",
              marginTop: "1rem",
              objectFit: "cover",
            }}
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
          <h6>
            Time Remaining :{" "}
            {remainingTime <= 0 ? "Auction ended" : remainingTime}
          </h6>
          {remainingTime <= 0 ? (
            `${singleProduct.productName} goes to ${currentBidder} for Rs${currentPrice}`
          ) : (
            <>
              <h6>Current Price : {currentPrice} </h6>
              <h6>Current Bidder :{currentBidder} </h6>
            </>
          )}

          <hr />
          <div style={{ gap: "4px" }}>
            <form>
              {basePriceError && (
                <p style={{ color: "red" }}>
                  The bidding amount must be greater than{" "}
                  {singleProduct.basePrice}
                </p>
              )}
              {currentPriceError && (
                <p style={{ color: "red" }}>
                  The bidding amount must be greaters than {currentPrice}
                </p>
              )}
              {/* <Timer duration={singleProduct?.duration} /> */}
              {user === singleProduct.username?.username ? (
                <>
                  {remainingTime <= 0 ? (
                    <button disabled>Start bid</button>
                  ) : (
                    <button onClick={(e) => startBid(e)}>Start bid</button>
                  )}
                </>
              ) : (
                <>
                  {remainingTime <= 0 || !bidStarted ? (
                    <>
                      <input placeholder="$" type="number" disabled />
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
                      <button type="submit" onClick={(e) => placeBid(e)}>
                        Place bid
                      </button>
                    </>
                  )}
                  {/* <input
                    placeholder="$"
                    type="number"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                  <button type="submit" onClick={(e) => placeBid(e)}>
                    Place bid
                  </button> */}
                </>
              )}
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
