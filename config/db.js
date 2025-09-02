const mongoose = require("mongoose");
require('dotenv').config();
const DbConnect = () => {

    const mongoDB_url = process.env.MONGODB_URL;
  mongoose
    .connect(
      mongoDB_url
    )
    .then(() => console.log("DB connected"))
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { DbConnect };
