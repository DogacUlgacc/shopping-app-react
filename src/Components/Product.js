import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/Product.css";

const Product = () => {
  const BASE_URL = "http://localhost:8080/product";
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productInfo, setProductInfo] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [updateProductInfo, setUpdateProductInfo] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  const [enteredProductId, setEnteredProductId] = useState("");
  const [productIdForUpdate, setProductIdForUpdate] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [deleteWithId, setDeleteWithId] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [isProductFound, setIsProductFound] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleteAttempted, setIsDeleteAttempted] = useState(false);

  // 1. Get All Products
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/all`); // Fixed interpolation
      setProducts(response.data.content);
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
      const response = await axios.get(`${BASE_URL}/${productId}`); // Fixed interpolation
      setProduct(response.data);
    } catch (error) {
      console.error("Hata:", error);
      setProduct([]);
    }
  };

  // 3. Add a New Product (POST)
  const addProduct = async () => {
    if (!productInfo.name || !productInfo.price || !productInfo.quantity) {
      alert("Please fill the blanks!");
      setIsUpdating(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/add`, {
        // Fixed interpolation
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productInfo),
      });

      if (response.ok) {
        console.log("Product added.");
        fetchAllProducts();
        setProductInfo({ name: "", price: "", quantity: "" });
      } else {
        throw new Error("Ürün eklenirken hata oluştu");
      }
    } catch (error) {
      console.error("Hata:", error);
      alert("Ürün eklenirken bir hata oluştu");
    }
  };

  // 4. Update an Existing Product (PUT)
  const handleUpdate = async () => {
    setIsUpdating(true);
    setIsUpdated(false);
    setIsProductFound(true);

    if (
      !updateProductInfo.name ||
      !updateProductInfo.price ||
      !updateProductInfo.quantity
    ) {
      alert("Please fill the blanks!");
      setIsUpdating(false);
      return;
    }

    const updatedProduct = {
      name: updateProductInfo.name,
      quantity: parseInt(updateProductInfo.quantity),
      price: parseFloat(updateProductInfo.price),
    };
    console.log("Gönderilen Güncel Ürün:", updatedProduct);
    try {
      const response = await axios.put(
        `${BASE_URL}/update/${productIdForUpdate}`, // Fixed interpolation
        updatedProduct
      );

      if (response.status === 200) {
        console.log("Ürün başarıyla güncellendi!");
        setIsUpdated(true);
        setProductIdForUpdate("");
        setUpdateProductInfo({ name: "", quantity: "", price: "" });
        fetchAllProducts();
      }
    } catch (error) {
      console.error("Hata:", error);
      setIsProductFound(false);
      console.log("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 5. Delete a Product (DELETE)
  const deleteProduct = async (productId) => {
    const id = parseInt(productId, 10);
    setLoading(true);
    setIsDeleteAttempted(true); // Silme işlemi başlatıldı
    setIsDeleted(false); // Yeni işlem için sıfırla

    try {
      const response = await axios.get(`http://localhost:8080/product/${id}`); // Fixed interpolation
      if (!response.data) {
        console.log("Product not found!");
        setIsDeleted(false);
        return;
      }

      // Ürün varsa sil
      const deleteResponse = await axios.delete(`${BASE_URL}/delete/${id}`); // Fixed interpolation
      console.log("Product deleted!");
      setIsDeleted(true);

      // Ürün listesini yeniden yükle
      fetchAllProducts();
    } catch (error) {
      console.error("Hata:", error);
      setIsDeleted(false);
      setError(error);
    } finally {
      setDeleteWithId("");
      setLoading(false);
    }
  };

  // Fetch all products
  useEffect(() => {
    fetchAllProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="container my-5">
        <div className="product-manager mb-4">
          <h2 className="text-center">Product Manager</h2>

          {/* Display all products */}
          <h3 className="mt-4">All Products</h3>
          <ul className="list-group">
            {products.map((product) => (
              <li key={product.id} className="list-group-item">
                {product.name} - ${product.price} (Qty: {product.quantity})
              </li>
            ))}
          </ul>
        </div>

        {/* Product Search Section */}
        <div className="product-search mb-4">
          <h2 className="text-center">Ürün Arama</h2>
          <div className="input-group mb-3">
            <input
              type="number"
              className="form-control mb-3"
              value={enteredProductId}
              onChange={(e) => setEnteredProductId(e.target.value)}
              placeholder="Ürün ID girin"
            />
            <button
              className="btn btn-primary"
              onClick={() => fetchProductById(enteredProductId)}
            >
              Ara
            </button>
          </div>

          {isSearched && product ? (
            <div className="alert alert-info">
              <h3>Ürün Detayları</h3>
              <p>Adı: {product.name}</p>
              <p>Fiyat: ${product.price}</p>
              <p>Miktar: {product.quantity}</p>
            </div>
          ) : isSearched && !product ? (
            <div className="alert alert-danger">Product not found!</div>
          ) : null}
        </div>

        {/* Add New Product Section */}
        <div className="add-product mb-4">
          <h3 className="text-center">Add New Product</h3>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              value={productInfo.name}
              onChange={(e) =>
                setProductInfo((prevInfo) => ({
                  ...prevInfo,
                  name: e.target.value,
                }))
              }
              placeholder="Enter new product name"
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="number"
              className="form-control"
              value={productInfo.price}
              onChange={(e) =>
                setProductInfo((prevInfo) => ({
                  ...prevInfo,
                  price: e.target.value,
                }))
              }
              placeholder="Enter product price"
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="number"
              className="form-control"
              value={productInfo.quantity}
              onChange={(e) =>
                setProductInfo((prevInfo) => ({
                  ...prevInfo,
                  quantity: e.target.value,
                }))
              }
              placeholder="Enter product quantity"
            />
          </div>
          <button className="btn btn-success" onClick={addProduct}>
            Add New Product
          </button>
        </div>

        {/* Update Product Section */}
        <div className="update-product mb-4">
          <h3 className="text-center">Update Product</h3>
          <div className="form-group mb-3">
            <input
              type="number"
              className="form-control"
              value={productIdForUpdate}
              onChange={(e) => setProductIdForUpdate(e.target.value)}
              placeholder="Enter product ID"
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              value={updateProductInfo.name}
              onChange={(e) =>
                setUpdateProductInfo((prevInfo) => ({
                  ...prevInfo,
                  name: e.target.value,
                }))
              }
              placeholder="Enter new product name"
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="number"
              className="form-control"
              value={updateProductInfo.price}
              onChange={(e) =>
                setUpdateProductInfo((prevInfo) => ({
                  ...prevInfo,
                  price: e.target.value,
                }))
              }
              placeholder="Enter product price"
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="number"
              className="form-control"
              value={updateProductInfo.quantity}
              onChange={(e) =>
                setUpdateProductInfo((prevInfo) => ({
                  ...prevInfo,
                  quantity: e.target.value,
                }))
              }
              placeholder="Enter product quantity"
            />
          </div>
          <button className="btn btn-primary" onClick={handleUpdate}>
            Update Product
          </button>
        </div>

        {/* Delete Product Section */}
        <div className="delete-product mb-4">
          <h3 className="text-center">Delete Product</h3>
          <div className="form-group mb-3">
            <input
              type="number"
              className="form-control"
              value={deleteWithId}
              onChange={(e) => setDeleteWithId(e.target.value)}
              placeholder="Enter product ID to delete"
            />
          </div>
          <button
            className="btn btn-danger"
            onClick={() => deleteProduct(deleteWithId)}
          >
            Delete Product
          </button>
        </div>

        {isDeleteAttempted && isDeleted && (
          <div className="alert alert-success">
            Product deleted successfully!
          </div>
        )}

        {isDeleteAttempted && !isDeleted && (
          <div className="alert alert-danger">Error deleting product.</div>
        )}
      </div>
    </>
  );
};

export default Product;
