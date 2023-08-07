const jwt=require('jsonwebtoken');
const {UnauthenticatedError}=require('../errors');
const User = require('../models/User');

const authMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
    const token=authHeader.split(' ')[1];
    try {
        const payload=jwt.verify(token,process.env.jwt_secret);
       // const user=User.findById(payload.userId).select('-password');
        req.user={userId:payload.userId,name:payload.name};
        //console log(req.user);
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
}

module.exports=authMiddleware;