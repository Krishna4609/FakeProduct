import React, { useState, useEffect } from "react";
import "../styles/Sup.css";
import Web3 from "web3"; // Import Web3 library
import ProductRegistryABI from "../contract/ProductRegistry.json";
import { QrReader } from "react-qr-reader"; // Import QrReader from 'react-qr-reader'
import QrCode from "qrcode-reader";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Supplier() {
  const location = useLocation();
  const { state } = location || {};
  const { username, password } = state || {};

  const [supDetails, setSupDetails] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [verified, setVerified] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [supplierLocation, setSupplierLocation] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [qrCodeData, setQRCodeData] = useState(null); // State to store QR code data
  const [isScanning, setIsScanning] = useState(false); // State to track if scanning mode is active

  const [scanActive, setScanActive] = useState(true);

  const [choice, setChoice] = useState("");
  const [id, setId] = useState("");

  const [ownerWalletAddr, setOwnerWalletAddr] = useState("");

  // Initialize Web3 and contract instance
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
    fetchCurrentUser();
  }, []);

  // Function to handle QR code scan
  const handleScan = async (data) => {
    if (data) {
      setQRCodeData(data.text);
      setIsScanning(false);
      setScanActive(false);
      try {
        await fetchProductDetails(data.text);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.post("http://localhost:4000/supDetails", {
        username,
      });
      setSupDetails(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle QR code scan error
  const handleError = (err) => {
    console.error(err);
  };

  const handleVerify = async () => {
    if (choice === "manufacturer") {
      const res = await axios.post("http://localhost:4000/manById", { id });
      console.log(res.data.walletAddr);
      setOwnerWalletAddr(res.data.walletAddr);
    } else if (choice === "supplier") {
      const res = await axios.post("http://localhost:4000/supById", { id });
      setOwnerWalletAddr(res.data.walletAddr);
    }

    if (productDetails.supplierId === supDetails.supplierId) {
      setVerified(true);
    }
  };

  const handleAddDetails = async () => {
    try {
      let productId = qrCodeData;
      console.log(qrCodeData, productId);
      console.log(ownerWalletAddr);

      // Transfer ownership after adding supplier details
      await contractInstance.methods
        .transferOwnership(productId, window.ethereum.selectedAddress)
        .send({ from: ownerWalletAddr });

      // Call the smart contract method to add supplier details
      await contractInstance.methods
        .addSupplierDetails(productId, supplierLocation, supplierName)
        .send({ from: window.ethereum.selectedAddress });

      alert("Ownership is Transeffered and Supplier details added successfully!");
    } catch (error) {
      console.error(
        "Error adding supplier details and transferring ownership:",
        error
      );
    }
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
            setIsScanning(false); // Stop scanning
            setScanActive(false);
            fetchProductDetails(value.result);
          }
        };
        qr.decode(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //Block retrive
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

  return (
    <>
      <div>
        <div className="sup-container">
          <div className="sup-inner-container">
            <div className="sup-form-1">
              <label>Choose QR Code Option:</label>
              <div>
                <button
                  onClick={() => setIsScanning(true)}
                  disabled={!scanActive}
                >
                  Scan QR Code
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={!scanActive}
                />
              </div>
              {isScanning && (
                <QrReader
                  delay={300}
                  onError={handleError}
                  onResult={handleScan}
                  onScan={handleScan}
                  style={{ width: "100%" }}
                />
              )}
              <div className="man-or-sup">
                <label htmlFor="choice">Choose ID Type:</label>
                <select
                  id="choice"
                  onChange={(e) => setChoice(e.target.value)}
                  value={choice}
                >
                  <option value="">Select</option>
                  <option value="manufacturer">Manufacturer ID</option>
                  <option value="supplier">Supplier ID</option>
                </select>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </div>
            </div>
            <button className="add-sup-details" onClick={handleVerify}>
              Verify
            </button>
            <div className="error-msg"></div>
            {verified && (
              <div className="sup-form-2">
                <label htmlFor="shop-name">Supplier Name:</label>
                <input
                  type="text"
                  name="shop-name"
                  id="s-name"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                />
                <label htmlFor="shop-addr">Supplier Location:</label>
                <input
                  type="text"
                  name="shop-addr"
                  id="s-addr"
                  value={supplierLocation}
                  onChange={(e) => setSupplierLocation(e.target.value)}
                />
                <button className="add-sup-details" onClick={handleAddDetails}>
                  Add Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Supplier;
