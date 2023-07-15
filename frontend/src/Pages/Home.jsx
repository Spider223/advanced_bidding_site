import React, { useEffect, useState } from "react";
import Products from "../component/Products";
import axios from "axios";
import { Row } from "react-bootstrap";

export default function Home() {
  const [allProduct, setAllProduct] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/product/getProduct")
      .then((result) => {
        console.log(result.data.getproduct);
        setAllProduct(result.data.getproduct);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Row>
        {allProduct.map((item) => (
          <Products {...item} key={item._id} />
        ))}
      </Row>
    </div>
  );
}
