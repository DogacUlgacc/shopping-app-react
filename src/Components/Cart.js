import React, { useState } from "react";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerIdForSearch, setCustomerIdForSearch] = useState("");
  const [isSearched, setIsSearched] = useState(false);

  /* Fetch Cart By userId */
  const fetchCart = async (userId) => {
    setLoading(true);
    setIsSearched(false);

    try {
      const response = await axios.get(
        `http://localhost:8080/cart/${userId}/items`
      );
      setCart(response.data);
      setIsSearched(true);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        window.alert("Bu müşteri ID'siyle ilgili bir sepet bulunamadı.");
      } else {
        window.alert("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h2>Cart</h2>
        <input
          type="number"
          value={customerIdForSearch}
          onChange={(e) => setCustomerIdForSearch(e.target.value)}
          placeholder="Customer ID girin"
        />
        <button
          onClick={() => {
            if (customerIdForSearch) {
              fetchCart(customerIdForSearch);
            } else {
              alert("Lütfen bir müşteri ID'si girin!");
            }
          }}
        >
          Ara
        </button>

        {/* Arama yapılmışsa ve sonuç gösterilmeye hazırsa */}
        {isSearched &&
          (cart.length > 0 ? (
            <div>
              <h3>Ürün Detayları</h3>
              {cart.map((item, index) => (
                <div key={index}>
                  <p>Adı: {item.productName}</p>
                  <p>Fiyat: {item.price}</p>
                  <p>Miktar: {item.quantity}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>Ürün bulunamadı</p>
          ))}
      </div>
    </div>
  );
};

export default Cart;
