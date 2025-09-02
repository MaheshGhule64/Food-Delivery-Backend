const mongoose = require('mongoose');
const schema = mongoose.Schema;


const ordersSchema = new schema({

    userId:{type:String, required:true},
    items:{type:Array, required:true},
    amount:{type:Number, required:true},
    address:{type:Object, required:true},
    status:{type:String, default:"Food Processing"},
    date:{type:Date, default:Date.now()},
    payment:{type:Boolean, default:false}
});


const ordersModel = mongoose.model('order', ordersSchema);


module.exports = ordersModel;

