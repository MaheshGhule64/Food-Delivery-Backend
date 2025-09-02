const foodModel = require("../models/foodModel.js");
const fs = require("fs");

// add food item
const addFood = async (req, res) => {
  const image_filename = req.file.filename;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
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
    fs.unlink(`tmp/${food.image}`, () => {});
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

module.exports = { addFood, listFood, removeFood };
