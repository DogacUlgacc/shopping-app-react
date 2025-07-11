import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Customer from "./entity/Customer";
import Product from "./entity/Product";
import Cart from "./entity/Cart";
import Order from "./entity/Order";
import Homepage from "./pages/Homepage";
import Login from "./entity/Login";

import { Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Header from "./Components/Header";
// import Footer from "./Components/Footer";

import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function App() {
  const token = localStorage.getItem("token");

  // if (!token) {
  //   return (
  //     <Routes>
  //       <Route path="*" element={<Navigate to="/login" replace />} />
  //       <Route path="/login" element={<Login />} />
  //     </Routes>
  //   );
  // }

  // ✅ Eğer token varsa, uygulamanın geri kalanı
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/product" element={<Product />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
