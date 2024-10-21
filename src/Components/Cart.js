import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("http://localhost:8080/cart/3/items");
        setCart(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Cart Items</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <div>Total Price: {item.totalPrice}</div>
            <div>quantity: {item.quantity}</div>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
