import React, { useState, useEffect } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enteredProductId, setEnteredProductId] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductQuantity, setNewProductQuantity] = useState("");
  const [updateProductName, setUpdateProductName] = useState("");
  const [updateProductQuantity, setUpdateProductQuantity] = useState("");
  const [updateProductPrice, setUpdateProductPrice] = useState("");
  const [productIdForUpdate, setProductIdForUpdate] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [deleteWithId, setDeleteWithId] = useState("");
  // 1. Get All Products
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/product/all");
      setProducts(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Get Product by ID
  const fetchProductById = async (productId) => {
    setIsSearched(true); // Arama yapıldı
    try {
      const response = await axios.get(
        `http://localhost:8080/product/${productId}`
      );
      setProduct(response.data); // Ürün bulunduysa state güncellenir
    } catch (error) {
      console.error("Hata:", error);
      setProduct(null); // Ürün bulunamazsa null yapılır
    }
  };

  // 3. Add a New Product (POST)
  const addProduct = async () => {
    try {
      const response = await fetch("http://localhost:8080/product/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProductName,
          price: parseFloat(newProductPrice),
          quantity: parseInt(newProductQuantity),
        }),
      });

      if (response.ok) {
        console.log("Product added.");
        fetchAllProducts();
        setNewProductName("");
        setNewProductPrice("");
        setNewProductQuantity("");
      } else {
        throw new Error("Ürün eklenirken hata oluştu");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Ürün eklenirken bir hata oluştu");
    }
  };

  // 4. Update an Existing Product (PUT)
  const handleUpdate = async () => {
    if (
      !productIdForUpdate ||
      !updateProductName ||
      !updateProductQuantity ||
      !updateProductPrice
    ) {
      console.log("Lütfen tüm alanları doldurun!");
      return;
    }

    const updatedProduct = {
      name: updateProductName,
      quantity: parseInt(updateProductQuantity),
      price: parseFloat(updateProductPrice),
    };
    console.log("Gönderilen Güncel Ürün:", updatedProduct);
    try {
      const response = await axios.put(
        `http://localhost:8080/product/update/${productIdForUpdate}`,
        updatedProduct
      );

      if (response.status === 200) {
        console.log("Ürün başarıyla güncellendi!");
        setProductIdForUpdate("");
        setUpdateProductName("");
        setUpdateProductQuantity("");
        setUpdateProductPrice("");
        fetchAllProducts();
      } else {
        console.log("Ürün güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      console.log("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  // 5. Delete a Product (DELETE)
  const deleteProduct = async (productId) => {
    const id = parseInt(productId);
    if (isNaN(id)) {
      console.log("Geçerli bir ürün ID'si girin");
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:8080/product/delete/${id}`
      );
      console.log(`Ürün başarıyla silindi: ${response.data}`);
      fetchAllProducts();
    } catch (err) {
      console.error(
        "Silme hatası:",
        err.response ? err.response.data : err.message
      );
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products on component mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>
        <h2>Product Manager</h2>

        {/* Display all products */}
        <h3>All Products</h3>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price} (Qty: {product.quantity})
            </li>
          ))}
        </ul>
      </div>
      {/* Get Product by ID */}
      <div>
        <h2>Ürün Arama</h2>
        <input
          type="number"
          value={enteredProductId}
          onChange={(e) => setEnteredProductId(e.target.value)}
          placeholder="Ürün ID girin"
        />
        <button onClick={() => fetchProductById(enteredProductId)}>Ara</button>

        {/* Arama yapılmışsa ve sonuç gösterilmeye hazırsa */}
        {isSearched &&
          (product ? (
            <div>
              <h3>Ürün Detayları</h3>
              <p>Adı: {product.name}</p>
              <p>Fiyat: {product.price}</p>
              <p>Miktar: {product.quantity}</p>
            </div>
          ) : (
            <p>Ürün bulunamadı</p>
          ))}
      </div>

      {/* Add New Product */}
      <div>
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Enter new product name"
        />
        <input
          type="number"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
          placeholder="Enter product price"
        />
        <input
          type="number"
          value={newProductQuantity}
          onChange={(e) => setNewProductQuantity(e.target.value)}
          placeholder="Enter product quantity"
        />
        <button onClick={addProduct}>Add New Product</button>
      </div>

      {/* Update Product */}
      <div>
        <input
          type="number"
          value={productIdForUpdate}
          onChange={(e) => setProductIdForUpdate(e.target.value)}
          placeholder="Enter product ID"
        />
        <input
          type="text"
          value={updateProductName}
          onChange={(e) => setUpdateProductName(e.target.value)}
          placeholder="Enter new product name"
        />
        <input
          type="number"
          value={updateProductPrice}
          onChange={(e) => setUpdateProductPrice(e.target.value)}
          placeholder="Enter product price"
        />
        <input
          type="number"
          value={updateProductQuantity}
          onChange={(e) => setUpdateProductQuantity(e.target.value)}
          placeholder="Enter product quantity"
        />
        <button onClick={handleUpdate}>Update Product</button>
      </div>

      {/* Delete Product */}
      <div>
        <input
          type="number"
          value={deleteWithId}
          onChange={(e) => setDeleteWithId(e.target.value)}
          placeholder="Ürün ID girin"
        />
        <button onClick={() => deleteProduct(deleteWithId)}>
          Delete Product
        </button>
      </div>
    </div>
  );
};

export default Product;
