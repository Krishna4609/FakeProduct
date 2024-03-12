require("dotenv").config();
const express = require("express");
// import express from "express"; // to use this we need type module in json file
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port = 4000;
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/fakeproduct");

const ManufacturerModel = require("./models/manufacturer");
const SupplierModel = require("./models/supplier");

app.post("/manufacturersign", (req, res) => {
  ManufacturerModel.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      res.json("User Already exists. Please try again.");
    } else {
      ManufacturerModel.create(req.body)
        .then((manufacturer) => res.status(200).json(manufacturer))
        .catch((err) => res.status(500).json({ error: err.message }));
    }
  });
});


app.post("/suppliersign", (req, res) => {
  SupplierModel.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      res.json("User Already exists. Please try again.");
    } else {
      SupplierModel.create(req.body)
        .then((suplier) => res.json(suplier))
        .catch((err) => res.json(err));
    }
  });
});

app.post("/manufacturer", (req, res) => {
  const { username, password } = req.body;
  ManufacturerModel.findOne({ username: username })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("The password is incorrect");
        }
      } else {
        res.json("No user Found");
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/supplier", (req, res) => {
  const { username, password } = req.body;
  SupplierModel.findOne({ username: username })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json("Success");
        } else {
          res.json("The password is incorrect");
        }
      } else {
        res.json("No user Found");
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

//during production the port will be taken from env file for sure
app.listen(process.env.PORT || port, () => {
  console.log("running");
});
