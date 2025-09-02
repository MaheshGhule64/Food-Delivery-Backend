const jwt = require('jsonwebtoken');
require('dotenv').config();


const authMiddleware = (req, res, next) => {

    const {token} = req.headers;


    if(!token){
        return res.json({success:false, message:"Unauthorize user"});
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    
    req.body.user_id = token_decode.id; 
    

    next();


}

module.exports = authMiddleware;