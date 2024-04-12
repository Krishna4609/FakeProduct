import React, { useState, useEffect, useRef } from "react";
import "../styles/Man.css";
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
import Web3 from "web3"; // Import Web3 library
import ProductRegistryABI from "../contract/ProductRegistry.json";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../globalRoutes/authUtil";

function Manufacturer() {
  const location = useLocation();
  const { state } = location || {};
  const { username, password } = state || {};

  const [isActive, setIsActive] = useState(true);
  const [qrPressed, setQrPressed] = useState();
  const [serialNumber, setSerialNumber] = useState(0);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [manufacturerLocation, setManufacturerLocation] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [contractInstance, setContractInstance] = useState(null);

  const [walletAddr, setWalletAddr] = useState("");
  const qrCodeRef = useRef(null);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  // Initialize Web3
  const initWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      console.log("ProductRegistryABI:", ProductRegistryABI);
      const contractAddress = "0xa1FaBEaD73837BB951dE487319C12D491D98bD0D";
      const instance = new web3.eth.Contract(
        ProductRegistryABI.abi,
        contractAddress
      );

      setContractInstance(instance);
    } else {
      console.log("Please install MetaMask!");
    }
  };

  const generateRandomSerial = () => {
    console.log(username);
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const serialLength = 8;
    let serial = "";
    for (let i = 0; i < serialLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      serial += characters.charAt(randomIndex);
    }
    return serial;
  };

  const handleGenSerial = (e) => {
    const newSerial = generateRandomSerial();
    setSerialNumber(newSerial);
    setIsActive(false);
  };

  const handleQrPressed = (e) => {
    setQrPressed(1);
  };

  const handleAddProduct = async () => {
    console.log(walletAddr);
    try {
      await contractInstance.methods
        .addManufacturerDetails(
          serialNumber,
          manufacturerLocation,
          username,
          supplierId,
          productName,
          productDescription
        )
        .send({ from: walletAddr });

      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDownloadQRCode = () => {
    if (qrCodeRef.current) {
      const canvas = qrCodeRef.current.getElementsByTagName("canvas")[0];
      canvas.toBlob((blob) => {
        saveAs(blob, `${serialNumber}.png`);
      });
    }
  };

  useEffect(() => {
    if(isAuthenticated() === username){
      console.log(isAuthenticated())
      setIsAuth(true);
      initWeb3();
      fetchManDetails();
    }
    else {
      alert("Please LogIn Using the portal");
      navigate("/main");
    }
  }, []);

  const fetchManDetails = () => {
    axios
      .post("http://localhost:4000/manDetails", { username })
      .then((response) => {
        console.log(response.data.walletAddr);
        setWalletAddr(response.data.walletAddr);
      });
  };

  return (
    <>
      {isAuth && (
        <>
          <div className="man-container">
            <div className="inner-container">
              <div className="inner-container1">
                <div className="serial-container">
                  <p>Serial Number</p>
                  <button
                    className="serial-gen-btn"
                    onClick={handleGenSerial}
                    disabled={!isActive}
                  >
                    Generate Serial Number
                  </button>
                </div>
                <div className="serial-number">{serialNumber}</div>
                <div className="prod-details">
                  <label htmlFor="prod-name">Name of Product</label>
                  <input
                    type="text"
                    name="prod-name"
                    id="p-name"
                    onChange={(e) => setProductName(e.target.value)}
                  />
                  <label htmlFor="prod-descr">Product Description</label>
                  <textarea
                    name="prod-descr"
                    id="p-descr"
                    className="text-box"
                    rows={5}
                    onChange={(e) => setProductDescription(e.target.value)}
                  />
                  <label htmlFor="man-loc">Manufacturer Location</label>
                  <input
                    type="text"
                    name="man-loc"
                    id="m-loc"
                    onChange={(e) => setManufacturerLocation(e.target.value)}
                  />
                  <label htmlFor="supplier">Supplier ID</label>
                  <input
                    type="text"
                    name="supplier"
                    id="s-name"
                    onChange={(e) => setSupplierId(e.target.value)}
                  />
                </div>
                <div className="prod-btns">
                  <button onClick={handleAddProduct}>Add Product</button>
                </div>
              </div>
              <div className="QR-code">
                <button onClick={handleQrPressed}>Generate QR Code</button>
                {qrPressed === 1 && (
                  <>
                    <div className="qr-image" ref={qrCodeRef}>
                      <QRCode
                        value={serialNumber}
                        size={128}
                        includeMargin={true}
                      />
                    </div>{" "}
                    <button
                      className="download-btn"
                      onClick={handleDownloadQRCode}
                    >
                      Download QR Code
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Manufacturer;
