const foodModel = require("../models/foodModel.js");
const fs = require("fs");
const path = require("path");
const {Storage} = require('@google-cloud/storage')


// add food item
const addFood = async (req, res) => {
  // const image_filename = req.file.originalname;

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

  let keyFilename = "key.json";
  const storage = new Storage({
    keyFilename
  });


   try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const bucket = storage.bucket('food-delivery-food-images');
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
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
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

//    try {
//     if (!req.file) return res.status(400).send("No file uploaded.");

//     const bucketName = 'food-delivery-food-images'; // replace with your bucket
//      const tempDir = path.join("/tmp", "uploads");
//      console.log(tempDir);
//   const filePath = path.join(tempDir, req.file.originalname);
//      console.log(filePath);// path to local file
//   fs.writeFileSync(filePath, req.file.buffer);
//   const destination = `uploads/${req.file.originalname}`; // path in GCS

//   try {
//     // Upload file WITHOUT any ACLs (UBLA-safe)
//     await storage.bucket(bucketName).upload(filePath, {
//       destination,
//     });

//     console.log(`✅ File uploaded to gs://${bucketName}/${destination}`);
//     const image_url = `https://storage.cloud.google.com/${bucketName}/uploads/${req.file.originalname}`;
  //   const food = new foodModel({
  //   name: req.body.name,
  //   description: req.body.description,
  //   price: req.body.price,
  //   category: req.body.category,
  //   image: image_url,
  // }); 
  
  // try {
  //   await food.save();
  //   res.json({ success: true, message: "Food Added" });
  // } catch (err) {
  //   console.log(err);
  //   res.json({ success: false, message: "Error" });
  // } 

//    } catch (error) {
//     console.error('❌ Upload failed:', error.message);
//   }
  
// }catch(err){
//   console.log(err);
//   res.status(500).send(err);
// }
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
