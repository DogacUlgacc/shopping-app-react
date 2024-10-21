import React, { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("http://localhost:8080/product/all");
        setProduct(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Product</h2>
      <ul>
        {product.map((product) => (
          <div>
            <li> Product name: {product.name}</li>
            <li> Product price: {product.price}</li>
            <li> Product quantity: {product.quantity}</li>
            <br />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Product;
