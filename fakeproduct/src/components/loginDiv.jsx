import React from "react";
import "../styles/loginDiv.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";



function LoginDiv({ toggler }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSignIn = () => {
    if (toggler === 0) {
      
      axios
        .post("http://localhost:4000/manufacturer", { username, password })
        .then((response) => {
          console.log(response);
          if (response.data === "Success") {
            navigate("/main/manufacturer", { state: { username, password } });

          } else {
            setMessage(response.data);
          }
        })
        .catch((err) => console.log(err));
    } else if (toggler === 1) {
      

      axios
        .post("http://localhost:4000/supplier", { username, password })
        .then((response) => {
          console.log(response);
          if (response.data === "Success") {
            navigate("/main/supplier",{ state: { username, password } });
          } else {
            setMessage(response.data);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSignUp = () => {
    if (toggler === 0) {
      navigate("/main/regmanufacturer");
    } else if (toggler === 1) {
      navigate("/main/regsupplier");
    }
  };

  

  return (
    <>
      <div className="login-container">
        <div className="log-form">
          <label htmlFor="user">Username</label>
          <input
            type="text"
            name="username"
            id="user"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="pass">Password</label>
          <input
            type="password"
            name="password"
            id="pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="errorMsg">
            <h5>{message}</h5>
          </div>
          <button className="siginbtn" onClick={handleSignIn}>
            Sign-In
          </button>
          <div className="spacing"></div>
          <button className="siginbtn" onClick={handleSignUp}>
            Sign-up
          </button>
        </div>
      </div>
    </>
  );
}

export default LoginDiv;
