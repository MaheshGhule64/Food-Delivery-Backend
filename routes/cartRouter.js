const express = require("express");
const cartRouter = express.Router();
const authMiddleware = require("../middlewares/auth.js");
const {
  addToCart,
  removeFromCart,
  getCartItems
} = require("../controllers/cartController.js");

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/getCart", authMiddleware, getCartItems);
cartRouter.post("/remove", authMiddleware, removeFromCart);

module.exports = cartRouter;
