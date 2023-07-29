import  { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import moment from "moment";
import io from "socket.io-client";
// import Timer from "../component/Timer";
import { useAuthStore } from "./store";
const socket = io.connect("http://localhost:5000");
// const socket = io.connect("http://localhost:8080");

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

  const [remainingTime, setRemainingTime] = useState("");
  const [bidStarted, setBidStarted] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/product/singlePost/${id}`)
      .then((result) => {
        setSingleProduct(result.data.singleProduct[0]);
        Number(setRemainingTime(result.data.singleProduct[0].remainingTime));
        setBidStarted(result.data?.singleProduct[0]?.auctionStarted);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const configuration = {
      method: "get",
      url: "http://localhost:5000/api/v1/user/profile",
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
      const res = await axios.post(
        `http://localhost:8080/api/v1/product/place-bid/${id}`,

        {
          bidder: info,
          price: userInput,
        }
      );
      if (res.data.status === 200) {
        // socket.emit("bit-paced", {
        //   bidder: res.data.product.lastBidder,
        //   price: res.data.product.currentPrice,
        // });
        setInterval(() => {
          if (bidStarted)
            axios
              .get(`http://localhost:8080/api/v1/product/singlePost/${id}`)
              .then((result) => {
                setCurrentBidder(result.data.singleProduct[0].lastBidder);
                setCurrentPrice(result.data.singleProduct[0].currentPrice);
              })
              .catch((err) => {
                console.log(err);
              });
        }, 1000);
      }

      // socket.emit("bidProduct", {
      //   userInput,
      //   last_bidder: singleProduct.username.username,
      //   info,
      //   duration: singleProduct.duration,
      //   id: singleProduct._id,
      // });
      // setBasePriceError(false);
      // setCurrentPriceError(false);
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

  // useEffect(() => {
  //   if (bidStarted)
  //     socket.on("watch-bid", ({ bidder, price }) => {
  //       setCurrentBidder(bidder);
  //       setCurrentPrice(price);
  //     });
  // }, [setCurrentBidder, setCurrentPrice, bidStarted]);

  return (
    <Container style={{ marginTop: "3rem" }}>
      <Row>
        <Col md={6}>
          <img
            src={"http://localhost:5000/" + singleProduct.cover}
            style={{ height: "25em", width: "25em", marginTop: "1rem", objectFit:"cover" }}
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
          <h6>Current Price : {currentPrice} </h6>
          <h6>Current Bidder :{currentBidder} </h6>
          <hr />
          <div style={{ gap: "4px" }}>
            <form>
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
                </>
              )}
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
