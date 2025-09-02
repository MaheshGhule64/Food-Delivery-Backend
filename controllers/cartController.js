const userModel = require("../models/userModel.js");

//addtocart api

const addToCart = async (req, res) => {
  try {
    const userData = await userModel.findById({ _id: req.body.user_id });
    const cartData = userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate({ _id: req.body.user_id }, { cartData });
    return res.json({ success: true, message: "Food added in the cart" });
  } catch (error) {
    return res.json({ success: false, message: "Error" });
  }
};

//remove from cart api

const removeFromCart = async (req, res) => {
  try {
    const userData = await userModel.findById({ _id: req.body.user_id });
    const cartData = userData.cartData;

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await userModel.findByIdAndUpdate({_id:req.body.user_id}, {cartData})

    return res.json({ success: true, message: "Food removed from cart" });
  } catch (error) {
    
    return res.json({ success: false, message: "Error" });
  }
};


//get cart items api

const getCartItems = async (req, res) =>{

    try{

        const userData = await userModel.findById({_id:req.body.user_id});
        const cartData = userData.cartData;
    

        return res.json({success:true, cartData});
    }
    catch(error){

        console.log(error)
        return res.json({success:false, message:"Error"});

    }
};

module.exports = { addToCart, removeFromCart, getCartItems };
