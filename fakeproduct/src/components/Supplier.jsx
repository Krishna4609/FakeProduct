import React, { useState, useEffect } from "react";
import "../styles/Sup.css";
import Web3 from "web3"; // Import Web3 library
import ProductRegistryABI from "../contract/ProductRegistry.json";
import { QrReader } from "react-qr-reader"; // Import QrReader from 'react-qr-reader'
import QrCode from "qrcode-reader";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../globalRoutes/authUtil";
import Nav from "./Navbar";
import QRCode from "qrcode.react";

function Supplier() {
  const location = useLocation();
  const { state } = location || {};
  const { username, password } = state || {};

  const [supDetails, setSupDetails] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [verified, setVerified] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [supplierLocation, setSupplierLocation] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [qrCodeData, setQRCodeData] = useState(null); // State to store QR code data
  const [isScanning, setIsScanning] = useState(false); // State to track if scanning mode is active

  const [scanActive, setScanActive] = useState(true);

  const [choice, setChoice] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [ownerWalletAddr, setOwnerWalletAddr] = useState(""); // Owner(Manufacturer Addresss)
  const [walletAddr, setWalletAddr] = useState(""); //Logged IN Supplier Address
  const [isAuth, setIsAuth] = useState(false);

  const [sellingLocations, setSellingLocations] = useState([]);
  const [totalSellingLocations, setTotalSellingLocations] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  // Initialize Web3 and contract instance
  useEffect(() => {
    if (isAuthenticated() === username) {
      console.log(isAuthenticated());
      setIsAuth(true);
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
    } else {
      alert("Please LogIn Using the portal");
      navigate("/");
    }
  }, []);

  // Function to handle QR code scan
  const handleScan = async (data) => {
    if (data) {
      setQRCodeData(data.text);
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

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.post("http://localhost:4000/supDetails", {
        username,
      });
      setSupDetails(response.data);
      setWalletAddr(response.data.walletAddr);
      console.log(response.data);
      setTotalSellingLocations(response.data.sellingLocations.length);
      console.log(totalSellingLocations);
      setSellingLocations(response.data.sellingLocations);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle QR code scan error
  const handleError = (err) => {
    console.error(err);
  };

  const handleVerify = async () => {
    // if (choice === "manufacturer") {
    const res = await axios.post("http://localhost:4000/manById", { id });
    console.log(res.data.walletAddr);
    setOwnerWalletAddr(res.data.walletAddr);
    // } else if (choice === "supplier") {
    //   const res = await axios.post("http://localhost:4000/supById", { id });
    //   setOwnerWalletAddr(res.data.walletAddr);
    // }

    if (
      productDetails.supplierId === supDetails.supplierId &&
      productDetails.manufacturerName === res.data.username
    ) {
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
        .transferOwnership(productId, walletAddr)
        .send({ from: ownerWalletAddr });

      // Call the smart contract method to add supplier details
      await contractInstance.methods
        .addSupplierDetails(
          productId,
          supplierLocation,
          supDetails.supplierName
        )
        .send({ from: walletAddr });

      alert(
        "Ownership is Transeffered and Supplier details added successfully!"
      );
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
            setIsUploaded(true);
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

  const handleNewLocation = (e) => {
    setNewLocation(e.target.value);
  };

  async function handleAddLocation(e) {
    try {
      const res = await axios.post("http://localhost:4000/add-location", {
        username: username,
        location: newLocation,
      });
    } catch (e) {
      alert("Location already exists");
    }

    fetchCurrentUser();
  }

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
      {isAuth && (
        <>
          <Nav />
          <div className="container2">
            <div className="Account-details">
              <div className="acc-username">
                <div className="acc-icon"></div>
                <div className="acc-user">{supDetails.supplierName}</div>
              </div>
              <div className="selling-locations">
                <table>
                  <th>Available-Locations</th>
                  <tr>
                    {sellingLocations.map((location, index) => (
                      <tr key={index}>
                        <td>{location}</td>
                      </tr>
                    ))}
                  </tr>
                  <tr>
                    {totalSellingLocations < 8 && (
                      <>
                        <input
                          type="text"
                          placeholder="Supplier Location"
                          value={newLocation}
                          onChange={handleNewLocation}
                        />
                        <button onClick={handleAddLocation}>
                          Add Location
                        </button>
                      </>
                    )}
                  </tr>
                </table>
              </div>
            </div>
            <div>
              <div className="sup-container">
                <div className="sup-inner-container">
                  <h1>Update Product Details</h1>
                  <div className="sup-form-1">
                    <label>Choose QR Code Option:</label>
                    <div className="qr-options">
                      <button
                        onClick={() => setIsScanning(true)}
                        disabled={!scanActive}
                        className="scan-btn"
                      >
                        Scan QR Code
                      </button>
                      <div class="file-input-wrapper">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUpload}
                          disabled={!scanActive}
                        />
                        <button class="custom-button" disabled={!scanActive}>
                          Choose a file
                        </button>
                      </div>
                      <button className="reset" onClick={handleReset}>
                        Reset
                      </button>
                    </div>
                    {isScanning && (
                      <QrReader
                        className="qr-reader"
                        delay={300}
                        onError={handleError}
                        onResult={handleScan}
                        onScan={handleScan}
                        style={{ width: "100%" }}
                      />
                    )}
                    {isUploaded && (
                      <>
                        <div className="qr-image1">
                          <QRCode
                            value={qrCodeData}
                            size={128}
                            includeMargin={true}
                          />
                        </div>
                      </>
                    )}

                    <div className="man-or-sup">
                      {/* <label htmlFor="choice">Choose ID Type:</label>
                      <select
                        id="choice"
                        onChange={(e) => setChoice(e.target.value)}
                        value={choice}
                      >
                        <option value="">Select</option>
                        <option value="manufacturer">Manufacturer ID</option>
                      </select> */}
                      <input
                        type="text"
                        placeholder="Enter Manufacturer ID"
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
                      <label htmlFor="shop-addr">Seller Location:</label>
                      <select
                        name="shop-addr"
                        id="s-addr"
                        value={supplierLocation}
                        onChange={(e) => setSupplierLocation(e.target.value)}
                      >
                        {sellingLocations.map((location, index) => (
                          <option key={index} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                      <br />
                      <button
                        className="add-sup-details"
                        onClick={handleAddDetails}
                      >
                        Add Details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Supplier;
