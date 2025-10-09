require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const path = require("path");
const port = process.env.PORT;
const { DbConnect } = require("./config/db.js");
const foodRouter = require("./routes/foodRouter.js");
const userRouter = require("./routes/userRoutes.js");
const cartRouter = require("./routes/cartRouter.js");
const orderRouter = require("./routes/orderRouter.js");

//middleware

app.use(express.json());

const allowedOrigins = [
   process.env.FRONTEND_URL,
   process.env.ADMIN_URL
];

app.use(cors({
    origin: (origin, callback) => {
     if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
    },
    credentials: true, // if you need cookies/auth headers
  }));


// DB Connection
DbConnect();

//api endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
// app.use("/images", express.static("/tmp/uploads"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
