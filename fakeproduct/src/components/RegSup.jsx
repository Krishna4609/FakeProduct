import React, { useState } from "react";
import "../styles/RegMan.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegMan() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [sellingLocations, setSellingLocations] = useState([""]);

  async function handleSignUp(e) {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:4000/suppliersign", {
        username,
        password,
        walletAddr,
        supplierName,
        sellingLocations,
      });
  
      if (response.data !== "User Already exists. Please try again.") {
        alert(
          `Registration Successful! Your SupplierId is ${response.data.supplierId}`
        );
  
        // Redirect to main page or do further actions
        navigate("/main");
      } else {
        setMessage("Duplicate username. Please choose a different username.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }
  

  const handleWalletChange = (e) => {
    setWalletAddr(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSupplierNameChange = (e) => {
    setSupplierName(e.target.value);
  };

  const handleSellingLocationChange = (index, value) => {
    const newLocations = [...sellingLocations];
    newLocations[index] = value;
    setSellingLocations(newLocations);
  };

  const addSellingLocation = () => {
    setSellingLocations([...sellingLocations, ""]);
  };

  const removeSellingLocation = (index) => {
    const newLocations = [...sellingLocations];
    newLocations.splice(index, 1);
    setSellingLocations(newLocations);
  };

  return (
    <>
      <div className="main-body">
        <div className="form-body">
          <form onSubmit={handleSignUp}>
            <h3>Create a Supplier Account</h3>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div>
              <label htmlFor="wallet">Wallet Address:</label>
              <input
                type="text"
                id="wallet"
                name="wallet"
                value={walletAddr}
                onChange={handleWalletChange}
                required
              />
            </div>
            <div>
              <label htmlFor="supplierName">Supplier Name:</label>
              <input
                type="text"
                id="supplierName"
                name="supplierName"
                value={supplierName}
                onChange={handleSupplierNameChange}
                required
              />
            </div>
            <div>
              <label htmlFor="sellingLocations">Selling Locations:</label>
              {sellingLocations.map((location, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) =>
                      handleSellingLocationChange(index, e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeSellingLocation(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSellingLocation}>
                Add Selling Location
              </button>
            </div>
            <div>
              <button type="submit">Sign Up</button>
            </div>
            <div>{message}</div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegMan;
