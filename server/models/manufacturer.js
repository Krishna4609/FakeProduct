const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ManufacturerSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  walletAddr: {type:String,required:true}
});

const ManufacturerModel = model("Manufacturer", ManufacturerSchema);

module.exports = ManufacturerModel;
