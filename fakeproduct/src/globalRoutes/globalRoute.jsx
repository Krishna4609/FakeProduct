// globalRoute.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Main from "../components/Main";
import Manufacturer from "../components/Manufacturer";
import Supplier from "../components/Supplier";
import RegMan from "../components/RegMan";
import RegSup from "../components/RegSup";

function GlobalRoute() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/main/manufacturer" element={<Manufacturer />} />
        <Route path="/main/supplier" element={<Supplier />} />
        <Route path="/main/regmanufacturer" element={<RegMan />} />
        <Route path="/main/regsupplier" element={<RegSup />} />
      </Routes>
    </>
  );
}

export default GlobalRoute;
