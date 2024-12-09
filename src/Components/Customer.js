import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Customer.css";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    surname: "",
    email: "",
  });
  const [updateCustomerInfo, setUpdateCustomerInfo] = useState({
    name: "",
    surname: "",
    email: "",
  });
  const [customerIdForUpdate, setCustomerIdForUpdate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const [enteredProductId, setEnteredProductId] = useState("");
  const [deleteWithId, setDeleteWithId] = useState("");

  const BASE_URL = "http://localhost:8080/customer";

  // 1. Get All Products
  const fetchAllCustomer = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/all`);
      setCustomers(response.data); // Müşteri listesini güncelle
    } catch (error) {
      console.error("Hata:", error);
      setCustomers([]); // Hata durumunda müşteri listesi boş yapılır
    } finally {
      setLoading(false);
    }
  };

  // 2. Get Customer by ID
  const fetchCustomerById = async (customerId) => {
    setIsSearched(true);
    try {
      const response = await axios.get(`${BASE_URL}/${customerId}`);
      setCustomer(response.data);
    } catch (error) {
      console.log(error);
      setCustomer(null);
    }
  };

  // 3. Add a New Customer (POST)
  const addCustomer = async () => {
    if (!customerInfo.name) {
      alert("Name field cannot be empty!");
      return;
    }
    if (!customerInfo.surname) {
      alert("Surname field cannot be empty!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerInfo.email || !emailRegex.test(customerInfo.email)) {
      alert("Please enter a valid email address!");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerInfo),
      });

      if (response.ok) {
        console.log("Customer added.");
        fetchAllCustomer();
        setCustomerInfo({ name: "", surname: "", email: "" });
      } else {
        throw new Error("Ürün eklenirken hata oluştu");
      }

      const data = await response.json();
      console.log(data);
      fetchAllCustomer();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  /* Update Customer */
  const handleUpdate = async () => {
    if (!updateCustomerInfo.email) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    const updateCustomer = {
      name: updateCustomerInfo.name,
      email: updateCustomerInfo.email,
      surname: updateCustomerInfo.surname,
    };
    console.log("Customer updated : ", updateCustomer);

    try {
      const response = await axios.put(
        `${BASE_URL}/update/${customerIdForUpdate}`,
        updateCustomer
      );
      if (response.status === 200) {
        console.log("Customer başarıyla güncellendi!");
        setCustomerIdForUpdate("");
        setUpdateCustomerInfo({ name: "", surname: "", email: "" });
        fetchAllCustomer();
      } else {
        console.log("Customer güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Hata:", error);
      console.log("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  /* Delete Customer  */
  const deleteCustomer = async (customerId) => {
    const id = parseInt(customerId);
    if (isNaN(id)) {
      alert("Geçerli bir customer Id giriniz!");
    }
    setLoading(true);
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`);
      console.log(`Customer başarıyla silindi: ${response.data}`);
      fetchAllCustomer();
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

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/all`);
        setCustomers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="customer-container">
      <div className="customers">
        <h2 className="customers-title">Customers</h2>
        <ul className="customer-list">
          {customers.map((customer) => (
            <li key={customer.id} className="customer-item">
              <p className="customer-detail">Customer name: {customer.name}</p>
              <p className="customer-detail">
                Customer surname: {customer.surname}
              </p>
              <p className="customer-detail">
                Customer email: {customer.email}
              </p>
              <br />
            </li>
          ))}
        </ul>
      </div>

      <div className="search-customer">
        <h2 className="search-title">Customer Arama</h2>
        <input
          type="number"
          className="search-input"
          value={enteredProductId}
          onChange={(e) => setEnteredProductId(e.target.value)}
          placeholder="Customer ID girin"
        />
        <button
          className="search-button"
          onClick={() => fetchCustomerById(enteredProductId)}
        >
          Ara
        </button>

        {isSearched &&
          (customer ? (
            <div className="customer-details">
              <h3 className="details-title">Customer Detayları</h3>
              <p className="detail-text">Adı: {customer.name}</p>
              <p className="detail-text">Soyadı: {customer.surname}</p>
              <p className="detail-text">E-posta: {customer.email}</p>
            </div>
          ) : (
            <p className="no-customer">Customer bulunamadı</p>
          ))}
      </div>

      <div className="add-customer">
        <h3 className="form-title">Add New Customer</h3>
        <input
          type="text"
          className="input-field"
          value={customerInfo.name}
          onChange={(e) =>
            setCustomerInfo((prevInfo) => ({
              ...prevInfo,
              name: e.target.value,
            }))
          }
          placeholder="Enter new customer name"
        />
        <input
          type="text"
          className="input-field"
          value={customerInfo.surname}
          onChange={(e) =>
            setCustomerInfo((prevInfo) => ({
              ...prevInfo,
              surname: e.target.value,
            }))
          }
          placeholder="Enter customer surname"
        />
        <input
          type="email"
          className="input-field"
          value={customerInfo.email}
          onChange={(e) =>
            setCustomerInfo((prevInfo) => ({
              ...prevInfo,
              email: e.target.value,
            }))
          }
          placeholder="Enter customer email"
        />
        <button className="add-button" onClick={addCustomer}>
          Add New Customer
        </button>
      </div>

      <div className="update-customer">
        <h3 className="form-title">Update Customer</h3>
        <input
          type="number"
          className="input-field"
          value={customerIdForUpdate}
          onChange={(e) => setCustomerIdForUpdate(e.target.value)}
          placeholder="Enter Customer Id"
        />
        <input
          type="text"
          className="input-field"
          value={updateCustomerInfo.email}
          onChange={(e) =>
            setUpdateCustomerInfo((prevInfo) => ({
              ...prevInfo,
              email: e.target.value,
            }))
          }
          placeholder="Enter Customer new email"
        />
        <button className="update-button" onClick={handleUpdate}>
          Update Customer
        </button>
      </div>

      <div className="delete-customer">
        <h3 className="form-title">Delete Customer</h3>
        <input
          type="number"
          className="input-field"
          value={deleteWithId}
          onChange={(e) => setDeleteWithId(e.target.value)}
          placeholder="Customer ID girin"
        />
        <button
          className="delete-button"
          onClick={() => deleteCustomer(deleteWithId)}
        >
          Delete Customer
        </button>
      </div>
    </div>
  );
};

export default Customer;
