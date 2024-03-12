// App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import ProductRegistryContract from './contracts/ProductRegistry.json';
import QRCode from 'qrcode.react';

const App = () => {
    const [productDetails, setProductDetails] = useState({
        productId: '',
        manufacturerLocation: '',
        supplierLocation: '',
    });

    const [productHistory, setProductHistory] = useState({});
    const [qrCodeGenerated, setQRCodeGenerated] = useState(false);

    const [testId,setTestId] = useState(0)
    const [contract, setContract] = useState(null);
    const [web3, setWeb3] = useState(null);


    useEffect(() => {
      const initWeb3 = async () => {
          if (window.ethereum) {
              const web3Instance = new Web3(window.ethereum);
              try {
                  await window.ethereum.enable();
                  console.log('Connected to MetaMask');
                  return web3Instance; // Return the initialized web3Instance
              } catch (error) {
                  console.error('User denied account access or other error occurred:', error);
              }
          } else {
              console.error('MetaMask extension not detected');
          }
          return null; // Return null if there's an issue
      };
  
      const setupContract = async (web3Instance) => {
          const contractAddress = '0x1b7dD5F6668fd25bCEF07312fc9dD784D0743b9c';
          const contractInstance = new web3Instance.eth.Contract(
              ProductRegistryContract.abi,
              contractAddress
          );
   
          setContract(contractInstance);
          setWeb3(web3Instance);
      };
  
      const initialize = async () => {
          const web3Instance = await initWeb3();
          if (web3Instance) {
              await setupContract(web3Instance);
          } else {
              console.error('Web3 initialization failed');
          }
      };
  
      initialize();
  }, []);

    useEffect(() => {
        if (qrCodeGenerated) {
            console.log('QR Code Generated:', productDetails.productId);
        }
    }, [qrCodeGenerated, productDetails.productId]);

    const handleChange = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };


    //  ADD MANUFARTURER DETAILS
    const addManufacturerDetails = async () => {
      if (!contract) {
          console.error('Contract not initialized');
          return;
      }
  
      const { productId, manufacturerLocation } = productDetails;
  
      try {
          const accounts = await web3.eth.getAccounts();
          await contract.methods
              .addManufacturerDetails(productId, manufacturerLocation)
              .send({ from: "0xa462185B24d89eE73c905617235652489CEF3370" }); // Assuming the first account is the user's account
          setQRCodeGenerated(true);
          alert('Manufacturer details added successfully');
      } catch (error) {
          console.error('Error adding manufacturer details:', error);
          alert('Error adding manufacturer details. Please check the console for more information.');
      }
  };

    const addSupplierDetails = async () => {
        await contract.methods
            .addSupplierDetails(productDetails.productId, productDetails.supplierLocation)
            .send({ from: '0x6dB4c4436b9871f87155251F7646D89005aDAd8d' });

        alert('Supplier details added successfully');
    };

    const handleRetrieveHistory = async () => {
      // Validate if product ID is provided
      if (!productDetails.productId) {
          alert('Please enter a valid product ID');
          return;
      }

      retrieveHistory();
  };

  const handleTestProduct = (e) => {
    const productIdValue = e.target.value;
    setProductDetails({ ...productDetails, productId: productIdValue });
};

const retrieveHistory = async () => {
  try {
    const result = await contract.methods.products(productDetails.productId).call({ gas: 4000000 });

      setProductHistory(result);
      console.log('Product History Retrieved:', result);
  } catch (error) {
      console.error('Error retrieving product history:', error);
      if (error.message.includes("Out of Gas")) {
          alert('Out of Gas: Try increasing the gas limit');
      } else {
          alert('Error retrieving product history. Please check the console for more information.');
      }
  }
};

  
    return (
        <div>
            <h1>Product Chain</h1>
            <div>
                <label>Product ID:</label>
                <input type="text" name="productId" onChange={handleChange} />
            </div>
            <div>
                <label>Manufacturer Location:</label>
                <input type="text" name="manufacturerLocation" onChange={handleChange} />
            </div>
            <div>
                <label>Supplier Location:</label>
                <input type="text" name="supplierLocation" onChange={handleChange} />
            </div>
            <button onClick={addManufacturerDetails}>Add Manufacturer Details</button>
            <div>
                {qrCodeGenerated && (
                    <div>
                        <h2>QR Code:</h2>
                        <QRCode value={productDetails.productId} />
                    </div>
                )}
            </div>
            <div>
                <h2>Product History:</h2>
                <pre>{JSON.stringify(productHistory, null, 2)}</pre>
            </div>
            <button onClick={addSupplierDetails}>Add Supplier Details</button>
            <div>
                <label>Product ID:</label>
                <input type="text" name="productId" onChange={handleTestProduct}/>
                <button onClick={handleRetrieveHistory}>Retrieve History</button>
            </div>
        </div>
    );
};

export default App;
