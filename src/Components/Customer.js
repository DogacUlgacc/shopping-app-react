import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Customer.css";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState([]);
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCustomerFound, setIsCustomerFound] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);

  // 1. Get All Products
  const fetchAllCustomer = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/all`); // Corrected interpolation
      setCustomers(response.data.content); // Müşteri listesini güncelle
    } catch (error) {
      console.error("Hata:", error);
      setCustomers([]); // Hata durumunda müşteri listesi boş yapılır
    } finally {
      setLoading(false);
    }
  };

  // 2. Get Customer by ID
  const fetchCustomerById = async (customerId) => {
    setIsSearched(true);
    try {
      const response = await axios.get(`${BASE_URL}/${customerId}`); // Corrected interpolation
      setCustomer(response.data);
    } catch (error) {
      console.log(error);
      setCustomer([]);
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
        // Corrected interpolation
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
        throw new Error("Ürün eklenirken hata oluştu");
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
    setIsUpdating(true);
    setIsCustomerFound(true);
    setIsUpdated(false);

    if (!updateCustomerInfo.email || !customerIdForUpdate) {
      alert("Please fill the blanks!");
      setIsUpdating(false);
      return;
    }

    const updateCustomer = {
      name: updateCustomerInfo.name,
      email: updateCustomerInfo.email,
      surname: updateCustomerInfo.surname,
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/update/${customerIdForUpdate}`, // Corrected interpolation
        updateCustomer
      );

      if (response.status === 200) {
        console.log("Customer başarıyla güncellendi!");
        setIsUpdated(true);
        setCustomerIdForUpdate("");
        setUpdateCustomerInfo({ name: "", surname: "", email: "" });
        fetchAllCustomer();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("Customer bulunamadı.");
        setIsCustomerFound(false); // Müşteri bulunamazsa false yap
      } else {
        console.error("Bir hata oluştu:", error);
      }
    } finally {
      setIsUpdating(false); // İşlem bittiğinde yükleme durumu
    }
  };

  /* Delete Customer  */
  const deleteCustomer = async (customerId) => {
    const id = parseInt(customerId);
    if (isNaN(id)) {
      alert("Geçerli bir customer Id giriniz!");
    }
    setLoading(true);
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`); // Corrected interpolation
      console.log(`Customer başarıyla silindi: ${response.data}`);
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
        const response = await axios.get(`${BASE_URL}/all`); // Corrected interpolation
        setCustomers(response.data.content);
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
    <div className="container my-5">
      <div className="customers mb-4">
        <h2 className="text-center">Customers</h2>
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
          className="search-input form-control mb-1"
          value={enteredProductId}
          onChange={(e) => setEnteredProductId(e.target.value)}
          placeholder="Customer ID girin"
        />
        <button
          className="btn btn-primary"
          onClick={() => fetchCustomerById(enteredProductId)}
        >
          Ara
        </button>

        {isSearched &&
          (customer ? (
            <div className="alert alert-info">
              <h3 className="details-title">Customer Detayları</h3>
              <p className="detail-text">Adı: {customer.name}</p>
              <p className="detail-text">Soyadı: {customer.surname}</p>
              <p className="detail-text">E-posta: {customer.email}</p>
            </div>
          ) : (
            <p className="alert alert-danger">Customer not found!</p>
          ))}
      </div>

      <div className="add-customer mb-4   ">
        <h3 className="text-center">Add New Customer</h3>
        <div className="form-group mb-3">
          <input
            type="text"
            className="form-control mb-3"
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
            className="form-control mb-3"
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
            className="form-control"
            value={customerInfo.email}
            onChange={(e) =>
              setCustomerInfo((prevInfo) => ({
                ...prevInfo,
                email: e.target.value,
              }))
            }
            placeholder="Enter customer email"
          />
        </div>
        <button className="btn btn-success " onClick={addCustomer}>
          Add New Customer
        </button>
      </div>

      <div className="update-customer">
        <h3 className="form-title">Update Customer</h3>
        <input
          type="number"
          className="form-control mb-3"
          value={customerIdForUpdate}
          onChange={(e) => setCustomerIdForUpdate(e.target.value)}
          placeholder="Enter Customer Id"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={updateCustomerInfo.email}
          onChange={(e) =>
            setUpdateCustomerInfo((prevInfo) => ({
              ...prevInfo,
              email: e.target.value,
            }))
          }
          placeholder="Enter customer email"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={updateCustomerInfo.name}
          onChange={(e) =>
            setUpdateCustomerInfo((prevInfo) => ({
              ...prevInfo,
              name: e.target.value,
            }))
          }
          placeholder="Enter customer name"
        />
        <input
          type="text"
          className="form-control mb-3"
          value={updateCustomerInfo.surname}
          onChange={(e) =>
            setUpdateCustomerInfo((prevInfo) => ({
              ...prevInfo,
              surname: e.target.value,
            }))
          }
          placeholder="Enter customer surname"
        />
        <button
          className="btn btn-primary"
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default Customer;
