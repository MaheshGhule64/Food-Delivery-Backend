const Stripe = require('stripe');
const ordersModel = require('../models/ordersModel.js');
const userModel = require('../models/userModel.js');
require('dotenv').config();


const stripe = new Stripe(process.env.STRIPE_KEY);
const frontend_url = process.env.FRONTEND_URL;

const placeOrder = async (req, res) => {

    const {orderData} = req.body;

    try{

        const newOrder = new ordersModel({
        userId:req.body.user_id,
        items:orderData.items,
        amount:orderData.amount,
        address:orderData.address
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.body.user_id, {cartData:{}});

    let line_items = orderData.items.map((item)=>({
        price_data:{
            currency:'inr',
            product_data:{
                name:item.name
            },
            unit_amount:item.price*100*80,
        },
        quantity:item.quantity
    }));

    line_items.push({
        price_data:{
            currency:'inr',
            product_data:{
                name:"Delivery Charge"
            },
            unit_amount:5*100*80
        },
        quantity:1
    });

    const session = await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:'payment',
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
    });


    return res.json({
        success:true, session_url:session.url
    });

    }catch(error){

        return res.json({success:false, message:"Error"});
    }
    
}


const verifyOrder = async (req, res) => {

    const {success, orderId} = req.body;

    try{

        
    if(success=='true'){
        await ordersModel.findByIdAndUpdate(orderId, {payment:true});
        return res.json({success:true, message:"Paid"})
    }
    else{

        await ordersModel.findByIdAndDelete(orderId);
        return res.json({success:false, message:"Payment fail"});

    }

    }catch(error){

        return res.json({success:false, message:"Error"});
    }

}


const userOrders = async (req, res) => {

    try{
       const orders = await ordersModel.find({userId:req.body.user_id});
       return res.json({success:true, data:orders});    
    }
    catch(error){
        return res.json({success:false, message:"Error"});
    }

}


//get all orders for admin

const listOrders = async (req, res) =>{
    try{

        const orders = await ordersModel.find({});
        res.json({success:true, data:orders});
    }
    catch(error){
        return res.json({success:false, message:"Error"});
    }
}

const updateStatus = async (req, res) => {

    try{

        await ordersModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"status updated"});
    }
    catch(error){
        res.json({success:false, message:"Error"});
    }
}


module.exports = {placeOrder, verifyOrder, userOrders, listOrders, updateStatus};