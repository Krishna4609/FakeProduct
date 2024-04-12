const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SupplierSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  walletAddr: { type: String, required: true },
  supplierId: { type: String, unique: true },
  supplierName: { type: String, required: true },
  sellingLocations: [{ type: String }] // Array of selling locations
});

SupplierSchema.pre("save", async function(next) {
  if (!this.supplierId) {
    // Generate a random number between 1000 and 9999
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    // Assign the supplier ID with the format 'SUP####'
    this.supplierId = `SUP${randomNumber}`;
  }

  // Check if the generated supplierId already exists
  const existingSupplier = await this.constructor.findOne({ supplierId: this.supplierId });
  if (existingSupplier) {
    return next(new Error("Supplier ID already exists")); // Abort save if ID already exists
  }

  next(); // Proceed with saving the document
});

const SupplierModel = model("Supplier", SupplierSchema);

module.exports = SupplierModel;
