const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 4000;
const ManufacturerModel = require("./models/manufacturer");
const SupplierModel = require("./models/supplier");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/fakeproduct");

// Routes for Manufacturer Registration
app.post("/manufacturersign", async (req, res) => {
  try {
    const existingUser = await ManufacturerModel.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.json("User Already exists. Please try again.");
    }

    const manufacturer = await ManufacturerModel.create(req.body);
    res.json({ manufacturerId: manufacturer.manufacturerId });
  } catch (err) {
    return res.json("Enter field");
  }
});

// Routes for Supplier Registration
app.post("/suppliersign", async (req, res) => {
  try {
    const existingUser = await SupplierModel.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.json("User Already exists. Please try again.");
    }

    const supplier = await SupplierModel.create(req.body);
    res.json({ supplierId: supplier.supplierId });
  } catch (err) {
    return res.json("Enter field");
  }
});

// Routes for Manufacturer Login
app.post("/manufacturer", async (req, res) => {
  try {
    const user = await ManufacturerModel.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res.json("No user Found");
    }

    if (user.password === req.body.password) {
      res.json("Success");
    } else {
      res.json("The password is incorrect");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes for Supplier Login
app.post("/supplier", async (req, res) => {
  try {
    const user = await SupplierModel.findOne({ username: req.body.username });
    if (!user) {
      return res.json("No user Found");
    }

    if (user.password === req.body.password) {
      res.json("Success");
    } else {
      res.json("The password is incorrect");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/supDetails", async (req, res) => {
  try {
    const user = await SupplierModel.findOne({ username: req.body.username });
    if (user) {
      res.json(user);
    } else {
      res.json("Invalid Request!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/manDetails", async (req, res) => {
  try {
    const user = await ManufacturerModel.findOne({
      username: req.body.username,
    });
    if (user) {
      res.json(user);
    } else {
      res.json("Invalid Request!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/manById", async (req, res) => {
  try {
    const user = await ManufacturerModel.findOne({
      manufacturerId: req.body.id,
    });
    if (user) {
      res.json(user);
    } else {
      res.json("Invalid Manufacturer ID");
    }
  } catch (err) {
    res.json(err);
  }
});

app.post("/supById", async (req, res) => {
  try {
    const user = await SupplierModel.findOne({ supplierId: req.body.id });
    if (user) {
      res.json(user);
    } else {
      res.json("Invalid Supplier ID");
    }
  } catch (err) {
    res.json(err);
  }
});

// Route to fetch unique selling locations of all suppliers
app.get("/supplier-locations", async (req, res) => {
  try {
    const locations = await SupplierModel.aggregate([
      { $unwind: "$sellingLocations" }, // Unwind the sellingLocations array
      { $group: { _id: "$sellingLocations" } }, // Group by sellingLocations field
      { $project: { _id: 0, location: "$_id" } }, // Project to rename _id to location
    ]);

    const uniqueLocations = locations.map((location) => location.location);
    res.json(uniqueLocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a location to sellingLocations array for a specific supplier
app.post("/add-location", async (req, res) => {
  try {
    const {username} = req.body.username
    let supplier = await SupplierModel.findOne({
      username: req.body.username,
    });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    if (supplier.sellingLocations.includes(req.body.location)) {
      return res
        .status(400)
        .json({ error: "Location already exists for this supplier" });
    }
    supplier = await SupplierModel.findOneAndUpdate(
      { username: req.body.username },
      { $push: { sellingLocations: req.body.location } },
    );
    res.json({ message: "Location added successfully", supplier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
