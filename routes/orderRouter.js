const express = require('express');
const authMiddleware = require('../middlewares/auth.js');
const {placeOrder, verifyOrder, userOrders, listOrders, updateStatus} = require('../controllers/ordersController.js');
const orderRouter = express.Router();





orderRouter.post('/placeorder', authMiddleware, placeOrder);
orderRouter.post('/verify', verifyOrder);
orderRouter.post('/userorders', authMiddleware, userOrders);
orderRouter.get('/listorders', listOrders);
orderRouter.post('/status', updateStatus);



module.exports = orderRouter;