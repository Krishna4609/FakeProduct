import React, { useState, useEffect } from "react";
import LoginDiv from "./loginDiv";
import "../styles/Main.css";
import Web3 from "web3"; // Import Web3 library
import ProductRegistryABI from "../contract/ProductRegistry.json";
import QrCode from "qrcode-reader";
import { QrReader } from "react-qr-reader";
import axios from "axios";

function Main() {
  const [toggler, setToggler] = useState(0);
  const [currLocation, setCurrLocation] = useState("");

  const [qrCodeData, setQRCodeData] = useState(null);
  const [scanActive, setScanActive] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [isScanning, setIsScanning] = useState(false);

  const [supplierLocations, setSupplierLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleClick = (state) => {
    setToggler(state);
  };

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);
        const contractAddress = "0xa1FaBEaD73837BB951dE487319C12D491D98bD0D";
        const instance = new web3Instance.eth.Contract(
          ProductRegistryABI.abi,
          contractAddress
        );
        setContractInstance(instance);
      } else {
        console.log("Please install MetaMask!");
      }
    };
    initWeb3();
  }, []);

  //Customer for fetching supplier location
  useEffect(() => {
    const fetchSupplierLocations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/supplier-locations"
        ); // Update the URL with your backend server URL
        setSupplierLocations(response.data);
      } catch (error) {
        console.error("Error fetching supplier locations:", error);
      }
    };
    fetchSupplierLocations();
  }, []);

  const handleScan = async (data) => {
    if (data) {
      setIsScanning(false);
      setScanActive(false);
      try {
        await fetchProductDetails(data.text);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const qr = new QrCode();
        qr.callback = (error, value) => {
          if (error) {
            console.error(error);
          } else {
            setQRCodeData(value.result);
            setScanActive(false);
            fetchProductDetails(value.result);
          }
        };
        qr.decode(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const productDetails = await contractInstance.methods
        .products(productId)
        .call();
      setProductDetails(productDetails);
      console.log(productDetails);
    } catch (error) {
      console.error("Error retrieving product details:", error);
      throw error;
    }
  };

  const handleSubmit = () => {
    if (productDetails.supplierLocation === currLocation) {
      alert("It is Genuine Product");
      setScanActive(true)
    } else {
      alert("Fake Product");
      setScanActive(true)
    }
  };

  const handleLocationChange = (event) => {
    setCurrLocation(event.target.value);
  };

  const handleCancelUpload = (e) =>{
    setScanActive(true)
  }

  return (
    <>
      <div className="main-container">
        <div className="main-box">
          <div className="user-box">
            <div
              className="toggler"
              style={{ left: `${toggler * 33.333}%` }}
            ></div>
            <button
              className="manubtn"
              value="0"
              onClick={() => handleClick(0)}
            >
              Manufacturer
            </button>
            <button className="supbtn" value="1" onClick={() => handleClick(1)}>
              Supplier
            </button>
            <button className="cusbtn" value="2" onClick={() => handleClick(2)}>
              Customer
            </button>
          </div>
          <div className="form-box">
            {toggler === 0 || toggler === 1 ? (
              <div className="manufacturer">
                <LoginDiv toggler={toggler} />
              </div>
            ) : null}
            {toggler === 2 ? (
              <>
                <div className="customer">
                  <select
                    value={selectedLocation}
                    onChange={handleLocationChange}
                  >
                    <option value="">Select The current location</option>
                    {supplierLocations.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>

                  {currLocation && (
                    <div className="currLocation">
                      <p>Selected Location: {currLocation}</p>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => setIsScanning(true)}
                      disabled={!scanActive}
                    >
                      Scan QR Code
                    </button>
                    {isScanning && (
                      <QrReader
                        delay={300}
                        onError={handleError}
                        onResult={handleScan}
                        onScan={handleScan}
                        style={{ width: "100%" }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpload}
                      disabled={!scanActive}
                    />
                    <button onClick={handleCancelUpload}>Cancel Upload</button>
                  </div>

                  <button className="submit-btn" onClick={handleSubmit}>
                    Submit
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;

