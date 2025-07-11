import React, { useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerIdForSearch, setCustomerIdForSearch] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  const BASE_URL = "http://localhost:8080/cart";

  /* Fetch Cart By userId */
  const fetchCart = async (userId) => {
    setLoading(true);
    setIsSearched(false);

    try {
      const response = await axios.get(`${BASE_URL}/${userId}/items`);
      setCart(response.data);
      setIsSearched(true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        window.alert("Bu müşteri ID'siyle ilgili bir sepet bulunamadı.");
      } else {
        window.alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container my-5">
      {/* Cart Section */}
      <div className="cart">
        <h2 className="text-center mb-4">Cart</h2>

        {/* Customer ID Input and Search Button */}
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            value={customerIdForSearch}
            onChange={(e) => setCustomerIdForSearch(e.target.value)}
            placeholder="Customer ID girin"
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (customerIdForSearch) {
                fetchCart(customerIdForSearch);
              } else {
                alert("Lütfen bir müşteri ID'si girin!");
              }
            }}
          >
            Ara
          </button>
        </div>

        {/* Cart Details */}
        {isSearched && cart.length > 0 ? (
          <div>
            <h3 className="mb-4">Sepet Detayı</h3>
            {cart.map((item, index) => (
              <div key={index} className="cart-item border p-3 mb-3 rounded">
                <p>
                  <strong>Adı:</strong> {item.productName}
                </p>
                <p>
                  <strong>Fiyat:</strong> ${item.price}
                </p>
                <p>
                  <strong>Miktar:</strong> {item.quantity}
                </p>
              </div>
            ))}
          </div>
        ) : isSearched && cart.length === 0 ? (
          <p className="alert alert-warning">Sepette ürün bulunamadı</p>
        ) : null}
      </div>
    </div>
  );
};

export default Cart;
