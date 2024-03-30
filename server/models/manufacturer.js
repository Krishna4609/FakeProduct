const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ManufacturerSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  walletAddr: { type: String, required: true },
  manufacturerId: { type: String, unique: true }
});

ManufacturerSchema.pre("save", async function(next) {
  if (!this.manufacturerId) {
    // Generate a random number between 1000 and 9999
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    // Assign the manufacturer ID with the format 'MAN####'
    this.manufacturerId = `MAN${randomNumber}`;
  }

  // Check if the generated manufacturerId already exists
  const existingManufacturer = await this.constructor.findOne({ manufacturerId: this.manufacturerId });
  if (existingManufacturer) {
    return next(new Error("Manufacturer ID already exists")); // Abort save if ID already exists
  }

  next(); // Proceed with saving the document
});

const ManufacturerModel = model("Manufacturer", ManufacturerSchema);

module.exports = ManufacturerModel;
