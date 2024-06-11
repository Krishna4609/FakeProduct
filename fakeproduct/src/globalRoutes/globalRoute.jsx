// GlobalRoute.js
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../components/Home";
import Manufacturer from "../components/Manufacturer";
import Supplier from "../components/Supplier";
import LoginDiv from "../components/loginDiv";
import Customer from "../components/Customer";

function GlobalRoute() {
  const location = useLocation();
  useEffect(() => {
    // Check if the current URL is "/main" and remove the session token
    if (location.pathname === "/" || location.pathname ==="/login/Manufacturer" || location.pathname ==="/login/Supplier" || location.pathname ==="/customer") {
      localStorage.removeItem("sessionToken");
    }
  }, [location]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/:user" element={<LoginDiv />} />
      <Route path="/customer" element={<Customer/>} />
      <Route path="/main/manufacturer" element={<Manufacturer />} />
      <Route path="/main/supplier" element={<Supplier />} />
    </Routes>
  );
}

export default GlobalRoute;
