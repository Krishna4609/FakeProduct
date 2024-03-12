import React, { useState } from "react";
import "../styles/Sup.css";

function Supplier() {

  const [verified, setVerified] = useState(false)

  const handleVerify = (e) =>{
    //condiions conditions conditions
    setVerified(true)
  }
  return (
    <>
      <div>
        <div className="sup-container">
          <div className="sup-inner-container">
            <div className="sup-form-1">
              <label htmlFor="qr-code">Upload QR Code of Product</label>
              <input type="file" name="qr-code" id="sup-qr" />
              <label htmlFor="Supplier Name">Supplier Name</label>
              <input type="text" />
            </div>
            <button className="add-sup-details" onClick={handleVerify}>Verify</button>
            <div className="error-msg"></div>
            {verified &&(<div className="sup-form-2">
              <label htmlFor="shop-name">Shop Name:</label>
              <input type="text" name="shop-name" id="s-name" />
              <label htmlFor="shop-addr">Shop Address:</label>
              <input type="text" name="shop-addr" id="s-addr" />
              <button className="add-sup-details">Add Details</button>
            </div>)}
          </div>
        </div>
      </div>
    </>
  );
}

export default Supplier;
