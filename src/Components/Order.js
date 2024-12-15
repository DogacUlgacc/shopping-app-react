import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [ordersForCustomer, setOrdersForCustomer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const BASE_URL = "http://localhost:8080/orders";

  // Get Orders for Customer
  const fetchOrdersForCustomer = async (customerId) => {
    setIsSearched(true);
    try {
      const response = await axios.get(`${BASE_URL}/customer/${customerId}`);
      setOrdersForCustomer(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        window.alert("Bu müşteri ID'siyle ilgili bir sepet bulunamadı.");
      } else {
        window.alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/all`);
        setOrders(response.data);
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
    <div className="container">
      <div>
        <h2>Orders</h2>
        <ul>
          {orders.map((order) => (
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
                      Product Name: {item.product.name}, Quantity:{" "}
                      {item.quantity}, Price: {item.price}
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

      <div>
        <h2 className="text-center">Customer Order</h2>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            value={customerId == null ? `` : customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Customer ID girin"
          />
          <button
            className="btn btn-primary"
            onClick={() => fetchOrdersForCustomer(customerId)}
          >
            Search
          </button>
        </div>

        {isSearched ? (
          <div>
            {ordersForCustomer && ordersForCustomer.length > 0 ? (
              <div className="alert alert-info">
                <h3>
                  {ordersForCustomer
                    .map((order) => order.customer.name)
                    .filter(
                      (name, index, self) => self.indexOf(name) === index
                    )}{" "}
                  {ordersForCustomer
                    .map((order) => order.customer.surname)
                    .filter(
                      (surname, index, self) => self.indexOf(surname) === index
                    )}
                </h3>
                <ul>
                  {ordersForCustomer.map((order) => (
                    <li key={order.id}>
                      <div>
                        <strong>Order Items:</strong>
                        <ul>
                          {order.orderItems.map((item) => (
                            <li key={item.id}>
                              Product Name: {item.product.name}, Quantity:{" "}
                              {item.quantity}, Price: {item.price}
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
            ) : (
              <div className="alert alert-warning">Customer not found!</div>
            )}
          </div>
        ) : (
          <div className="alert alert-info">
            Please search for a customer to view their orders.
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
