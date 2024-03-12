import React, { useState } from "react";
import "../styles/Man.css";
import QRCode from "qrcode.react";
import DownloadLink from "react-download-link";

function Manufacturer() {
  const [isActive, setIsActive] = useState(true);
  const [qrPressed, setQrPressed] = useState();
  const [serialNumber, setSerialNumber] = useState(0);

  const generateRandomSerial = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const serialLength = 8;
    let serial = '';
    for (let i = 0; i < serialLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      serial += characters.charAt(randomIndex);
    }
    return serial;
  };

  const handleGenSerial = (e) => {
    const newSerial = generateRandomSerial();
    setSerialNumber(newSerial)
    setIsActive(false);
  };

  const handleQrPressed = (e) => {
    setQrPressed(1);
  };


  return (
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
              <input type="text" name="prod-name" id="p-name" />
              <label htmlFor="prod-descr">Product Description</label>
              <textarea
                name="prod-descr"
                id="p-descr"
                className="text-box"
                rows={5}
              />
              <label htmlFor="man-loc">Manfacturer Location</label>
              <input type="text" name="man-loc" id="m-loc" />
              <label htmlFor="supplier">Supplier ID</label>
              <input type="text" name="supplier" id="s-name" />
            </div>
            <div className="prod-btns">
              <button>Add Product</button>
            </div>
          </div>
          <div className="QR-code">
            <button onClick={handleQrPressed}>Generate QR Code</button>
            {qrPressed === 1 && (
              <>
                <div className="qr-image">
                  <QRCode value={serialNumber} />
                </div>{" "}
                <button className="download-btn">Download QR Code</button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Manufacturer;
