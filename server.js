require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT;
const { DbConnect } = require("./config/db.js");
const foodRouter = require("./routes/foodRouter.js");
const userRouter = require("./routes/userRoutes.js");
const cartRouter = require("./routes/cartRouter.js");
const orderRouter = require("./routes/orderRouter.js");

//middleware

app.use(express.json());
app.use(cors({
  origin: "https://food-delivery-backend-git-main-maheshghule64s-projects.vercel.app",
  credentials: true
}));

// DB Connection
DbConnect();

//api endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/images", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
