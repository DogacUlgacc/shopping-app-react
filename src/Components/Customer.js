import React, { useEffect, useState } from "react";
import axios from "axios";

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
  // 1. Get All Products
  const fetchAllCustomer = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/customer/all"); // Fazladan '}' kaldırıldı
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
      const response = await axios.get(
        `http://localhost:8080/customer/${customerId}`
      );
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
      const response = await fetch("http://localhost:8080/customer/add", {
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
        `http://localhost:8080/customer/update/${customerIdForUpdate}`,
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
      const response = await axios.delete(
        `http://localhost:8080/customer/delete/${id}`
      );
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
        const response = await axios.get("http://localhost:8080/customer/all");
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
    <div>
      <div>
        <h2>Customers</h2>
        <ul>
          {customers.map((customer) => (
            <li>
              <li> Customer name : {customer.name}</li>
              <li> Customer : surname {customer.surname}</li>
              <li> Customer email: {customer.email}</li>
              <br />
            </li>
          ))}
        </ul>
      </div>
      <br></br>
      <div>
        <h2>Customer Arama</h2>
        <input
          type="number"
          value={enteredProductId}
          onChange={(e) => setEnteredProductId(e.target.value)}
          placeholder="Customer ID girin"
        />
        <button onClick={() => fetchCustomerById(enteredProductId)}>Ara</button>

        {/* Arama yapılmışsa ve sonuç gösterilmeye hazırsa */}
        {isSearched &&
          (customer ? (
            <div>
              <h3>Customer Detayları</h3>
              <p>Adı: {customer.name}</p>
              <p>Fiyat: {customer.surname}</p>
              <p>Miktar: {customer.email}</p>
            </div>
          ) : (
            <p>Customer bulunamadı</p>
          ))}
      </div>
      <div>
        {/* Add New Customer */}
        <div>
          <input
            type="text"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo((prevInfo) => ({
                ...prevInfo, // Mevcut state'in diğer alanlarını korur
                name: e.target.value, // Sadece name alanını günceller
              }))
            }
            placeholder="Enter new customer name"
          />
          <input
            type="text"
            value={customerInfo.surname}
            onChange={(e) =>
              setCustomerInfo((prevInfo) => ({
                ...prevInfo, // Mevcut state'in diğer alanlarını korur
                surname: e.target.value, // Sadece name alanını günceller
              }))
            }
            placeholder="Enter customer surname"
          />
          <input
            type="email"
            value={customerInfo.email}
            onChange={(e) =>
              setCustomerInfo((prevInfo) => ({
                ...prevInfo, // Mevcut state'in diğer alanlarını korur
                email: e.target.value, // Sadece name alanını günceller
              }))
            }
            placeholder="Enter customer email"
          />
          <button onClick={addCustomer}>Add New Customer</button>
        </div>
        {/* Update Customer */}
        <div>
          <input
            type="number"
            value={customerIdForUpdate}
            onChange={(e) => setCustomerIdForUpdate(e.target.value)}
            placeholder="Enter Customer Id"
          />
          <input
            type="text"
            value={updateCustomerInfo.email}
            onChange={(e) =>
              setUpdateCustomerInfo((prevInfo) => ({
                ...prevInfo,
                email: e.target.value,
              }))
            }
            placeholder="Enter Customer new mail"
          />
          <button onClick={handleUpdate}>Update Customer</button>
        </div>
      </div>
      {/* Delete Customer */}
      <div>
        <input
          type="number"
          value={deleteWithId}
          onChange={(e) => setDeleteWithId(e.target.value)}
          placeholder="Customer ID girin"
        />
        <button onClick={() => deleteCustomer(deleteWithId)}>
          Delete Customer
        </button>
      </div>
    </div>
  );
};

export default Customer;
