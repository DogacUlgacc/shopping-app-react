import React from "react";
import { Link } from "react-router-dom";
import "../style/Header.css";
function Header() {
  return (
    <div className="header-container">
      <div className="links">
        <Link to="/"> Homepage</Link>
        <Link to="/product"> Product</Link>
        <Link to="/customer"> Customer</Link>
        <Link to="/cart"> Cart</Link>
        <Link to="/order"> Order</Link>
        <Link to="/auth/login">Login</Link>
      </div>
    </div>
  );
}

export default Header;
