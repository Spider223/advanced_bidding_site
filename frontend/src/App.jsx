import AddProduct from "./Pages/AddProduct";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import SingleProduct from "./Pages/SingleProduct";
import Navbar from "./component/Navbar";
import ProtectedPages from "./protectedPages";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedPages />}>
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/singleProduct/:id" element={<SingleProduct />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
