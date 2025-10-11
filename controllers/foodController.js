const foodModel = require("../models/foodModel.js");
const fs = require("fs");
const path = require("path");
const bucket = require('../config/cloud_bucket.js')

// add food item
const addFood = async (req, res) => {

   try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const blob = bucket.file(Date.now() + "-" + req.file.originalname);

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
      predefinedAcl: "publicRead", // <-- makes file public
    });

    blobStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ error: "Upload error" });
    });

    blobStream.on("finish", async() => {
      const publicUrl = `https://storage.cloud.google.com/${bucket.name}/${blob.name}`;
       const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: publicUrl,
  }); 
        try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  } 
    });

    // Upload file buffer
    blobStream.end(req.file.buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// get food items

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (err) {
    res.json({ success: false, message: "Error" });
  }
};

//remove food item

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findByIdAndDelete(req.body.id);
  
    const image = food.image;
    const startpos = image.lastIndexOf('/');
    const filename = image.substring(startpos+1);   

    await bucket.file(filename).delete();
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

module.exports = { addFood, listFood, removeFood };
