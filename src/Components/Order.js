import React, { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get("http://localhost:8080/orders/all");
        setOrder(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Orders</h2>
      <ul>
        {order.map((order) => (
          <li key={order.id}>
            <div>
              <strong>Customer:</strong> {order.customer.name}{" "}
              {order.customer.surname}
            </div>
            <div>
              <strong>Order Items:</strong>
              <ul>
                {order.orderItems.map((item) => (
                  <li key={item.id}>
                    Product Name: {item.product.name}, Quantity: {item.quantity}
                    , Price: {item.price}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <strong>Total Price:</strong> {order.totalPrice}
            </div>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Order;
