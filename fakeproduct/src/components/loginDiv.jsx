import React, { useEffect } from "react";
import "../styles/loginDiv.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Nav from "./Navbar";

function LoginDiv() {
  const { user } = useParams();
  const [username, setUsername] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [walletAddr, setWalletAddr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
      setMessage("");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
      setMessage("");
    });

    // Clean up event listeners when component unmounts
    return () => {
      signUpButton.removeEventListener("click", () => {
        container.classList.add("right-panel-active");
        setMessage("");
      });

      signInButton.removeEventListener("click", () => {
        container.classList.remove("right-panel-active");
        setMessage("");
      });
    };
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    if (user === "Manufacturer") {
      axios
        .post("http://localhost:4000/manufacturer", { username, password })
        .then((response) => {
          console.log(response);
          if (response.data === "Success") {
            localStorage.setItem("sessionToken", username);
            navigate("/main/manufacturer", { state: { username, password } });
          } else {
            setMessage(response.data);
          }
        })
        .catch((err) => console.log(err));
    } else if (user === "Supplier") {
      axios
        .post("http://localhost:4000/supplier", { username, password })
        .then((response) => {
          console.log(response);
          if (response.data === "Success") {
            localStorage.setItem("sessionToken", username);
            navigate("/main/supplier", { state: { username, password } });
          } else {
            setMessage(response.data);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  async function handleSignUp(e) {
    e.preventDefault();
    if (user === "Manufacturer") {
      const response = await axios.post(
        "http://localhost:4000/manufacturersign",
        {
          username,
          password,
          walletAddr,
        }
      );

      if (response.data === "User Already exists. Please try again.") {
        setMessage("Duplicate username. Please choose a different username.");
      } else if (response.data === "Enter field") {
        setMessage("Field Should not be empty");
      } else {
        alert(
          `Registration Successful! Your Manufacturer ID is ${response.data.manufacturerId}`
        );

        // Redirect to main page or do further actions
        navigate("/login/Manufacturer");
      }
    } else if (user === "Supplier") {
      const response = await axios.post("http://localhost:4000/suppliersign", {
        username,
        password,
        walletAddr,
        supplierName,
      });

      if (response.data === "User Already exists. Please try again.") {
        setMessage("Duplicate username. Please choose a different username.");
      } else if (response.data === "Enter field") {
        setMessage("Field Should not be empty");
      } else {
        alert(
          `Registration Successful! Your SupplierId is ${response.data.supplierId}`
        );

        // Redirect to main page or do further actions
        navigate("/login/Supplier");
      }
    }
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleWalletChange = (e) => {
    setWalletAddr(e.target.value);
  };
  const handleSupplierChange = (e) => {
    setSupplierName(e.target.value);
  };

  return (
    <>
      <Nav />
      <div className="login-container">
        <div className="container1" id="container">
          <div className="form-container sign-up-container">
            <form action="#">
              <h1>
                Create Account {user === "Manufacturer" && <><p>as Manufacturer</p></>}
                {user === "Supplier" && <>as Supplier</>}
              </h1>

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />

              <input
                type="text"
                placeholder="Wallet Adrress"
                value={walletAddr}
                onChange={handleWalletChange}
                required
              />
              {user === "Supplier" && (
                <input
                  type="text"
                  placeholder="Supplier Name"
                  value={supplierName}
                  onChange={handleSupplierChange}
                  required
                />
              )}
              <p>{message}</p>
              <button onClick={handleSignUp}>Sign Up</button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form action="#">
              <h1>Sign in</h1>
              <span>or use your account</span>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <p>{message}</p>
              <button onClick={handleSignIn}>Sign In</button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>
                  To keep connected with us please login with your personal info
                </p>
                <button className="ghost" id="signIn">
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, {user}</h1>
                <p>Enter your personal details and start journey with us</p>
                <button className="ghost" id="signUp">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginDiv;
