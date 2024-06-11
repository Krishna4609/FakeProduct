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

  async function handleSignUp(e) {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:4000/manufacturersign",
        {
          username,
          password,
          walletAddr,
        }
      );
  
      if (response.data !== "User Already exists. Please try again.") {
        //RENDER NEW PAGE FOR SHOING ID AND SUCCESSFUL REGISTREATION
        alert(`Registration Successful! Your Manufacturer ID : ${response.data.manufacturerId}`)
        navigate("/main");
      } else {
        setMessage("Duplicate username. Please choose a different username.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }
  

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleWalletChange = (e) => {
    setWalletAddr(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <div className="main-body">
        <div className="form-body">
          <form onSubmit={handleSignUp}>
            <h3>Create a Manufacturer Account</h3>
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
              <button type="submit">
                Sign Up
              </button>
            </div>
            <div>{message}</div>
          </form>
        </div>
      </div>
    </>
  );
}

export default RegMan;
