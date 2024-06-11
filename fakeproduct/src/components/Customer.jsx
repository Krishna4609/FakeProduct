import React, { useState, useEffect } from "react";
import styles from "../styles/Main.module.css";
import Web3 from "web3"; // Import Web3 library
import ProductRegistryABI from "../contract/ProductRegistry.json";
import QrCode from "qrcode-reader";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import Nav from "./Navbar";
import QRCode from "qrcode.react";

function Customer() {
  const [currLocation, setCurrLocation] = useState("");

  const [qrCodeData, setQRCodeData] = useState(null);
  const [scanActive, setScanActive] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [isScanning, setIsScanning] = useState(false);
  const [isFake, setIsFake] = useState(0);

  const [supplierLocations, setSupplierLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [verified, setVerified] = useState(false);

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
      setIsUploaded(true);
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
            setIsScanning(false);
            setScanActive(false);
            fetchProductDetails(value.result);
            setIsUploaded(true);
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
    console.log(isUploaded, currLocation);
    if (
      isUploaded === false ||
      currLocation === "" ||
      currLocation === "Location"
    ) {
      alert("Upload QRcode and Select Location");
    } else {
      if (productDetails.supplierLocation === currLocation) {
        setIsFake(2);
      } else {
        setIsFake(1);
      }
    }
  };

  const handleLocationChange = (event) => {
    setCurrLocation(event.target.value);
  };

  const handleReset = (e) => {
    setScanActive(true);
    setIsScanning(false);
    setIsUploaded(false);
    setVerified(false);
    setQRCodeData(null);
    setProductDetails({});
  };

  return (
    <>
      <Nav />
      <div className={styles.maincontainer}>
        <div className={styles.custcontainer}>
          <div className={styles.customer}>
            <div className={styles.usform}>
              <label htmlFor="location">Select your current location : </label>
              <select onChange={handleLocationChange}>
                <option value={selectedLocation}>Location</option>
                {supplierLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                className={styles.scanbtn}
                onClick={() => setIsScanning(true)}
                disabled={!scanActive}
              >
                Scan QR Code
              </button>
              OR
              <div class="file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={!scanActive}
                />
                <button class={styles.custombutton1} disabled={!scanActive}>
                  Choose a file
                </button>
              </div>
              <button onClick={handleReset} className={styles.rstbtn}>
                Reset
              </button>
            </div>
            {isScanning && (
              <QrReader
                delay={300}
                onError={handleError}
                onResult={handleScan}
                onScan={handleScan}
                className={styles.qrreader}
                style={{ width: "100%" }}
              />
            )}
            {isUploaded && (
              <>
                <div className={styles.qrimage2}>
                  <QRCode value={qrCodeData} size={256} includeMargin={true} />
                </div>
              </>
            )}
          </div>
          <div className={styles.overlay1}>
            <h1>Product Verification</h1>
            <p>Check your Product authenticity</p>
            <p>Upload QRcode and Verify!</p>
            <button className="submit-btn" onClick={handleSubmit}>
              Verify
            </button>
            <div className="prod-status">
              <div className={styles.fakeorreal}>
                {isFake === 1 && (
                  <>
                    <img src={require("../images/fake.png")} />
                    <h1>Product Staus: Fake</h1>
                  </>
                )}
                {isFake === 2 && (
                  <>
                    <img src={require("../images/ori.png")} />
                    <h1>Product Staus: Genuine</h1>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Customer;
