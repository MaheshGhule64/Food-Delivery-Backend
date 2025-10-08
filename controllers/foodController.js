const foodModel = require("../models/foodModel.js");
const fs = require("fs");
const {Storage} = require('@google-cloud/storage')


// add food item
const addFood = async (req, res) => {
  // const image_filename = req.file.filename;

  // const food = new foodModel({
  //   name: req.body.name,
  //   description: req.body.description,
  //   price: req.body.price,
  //   category: req.body.category,
  //   image: image_filename,
  // });

  // try {
  //   await food.save();
  //   res.json({ success: true, message: "Food Added" });
  // } catch (err) {
  //   console.log(err);
  //   res.json({ success: false, message: "Error" });
  // }

  const storage = new Storage({
  projectId: "food-delivery-0909",
  keyFilename: "./config/service.json", // download from Cloud Console
});


   try {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const bucketName = 'food-delivery-food-images'; // replace with your bucket
  const filePath = `https://food-delivery-backend-jnud.onrender.com`;   // path to local file
  const destination = `uploads/${req.file.originalname}`; // path in GCS

  try {
    // Upload file WITHOUT any ACLs (UBLA-safe)
    await storage.bucket(bucketName).upload(filePath, {
      destination,
    });

    console.log(`✅ File uploaded to gs://${bucketName}/${destination}`);
    const image_url = `https://storage.cloud.google.com/${bucketName}/uploads/${req.file.originalname}`;
    const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_url,
  }); 
  
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Error" });
  } 

   } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
  
}catch(err){
  console.log(err);
  res.status(500).send(err);
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
