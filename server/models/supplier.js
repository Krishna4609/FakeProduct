const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SupplierSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  walletAddr: { type: String, required: true },
});

const SupplierModel = model("Supplier", SupplierSchema);

module.exports = SupplierModel;
