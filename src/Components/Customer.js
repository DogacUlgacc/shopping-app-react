import React, { useEffect, useState } from "react";
import axios from "axios";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  );
};

export default Customer;
