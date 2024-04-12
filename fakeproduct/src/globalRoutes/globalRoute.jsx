// GlobalRoute.js
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../components/Home";
import Main from "../components/Main";
import Manufacturer from "../components/Manufacturer";
import Supplier from "../components/Supplier";
import RegMan from "../components/RegMan";
import RegSup from "../components/RegSup";

function GlobalRoute() {
  const location = useLocation();
  useEffect(() => {
    // Check if the current URL is "/main" and remove the session token
    if (location.pathname === "/main") {
      localStorage.removeItem("sessionToken");
    }
  }, [location]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<Main />} />
      <Route path="/main/regmanufacturer" element={<RegMan />} />
      <Route path="/main/regsupplier" element={<RegSup />} />

      <Route path="/main/manufacturer" element={<Manufacturer />} />
      <Route path="/main/supplier" element={<Supplier />} />
    </Routes>
  );
}

export default GlobalRoute;
