const jwt = require("jsonwebtoken");
const User = require('../models/userSchema');


const authenticate = async (req , res , next) =>{
    try{
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token,"mernapplication5678912345");
        const rootUser = await User.findOne({_id:verifyToken._id , "tokens.token":token});
        if (!rootUser){
            throw new Error('User not found')
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
                                                               
    }catch(error){
        res.status(401).send('not unauth')
        console.log(error)
    }

}

module.exports = authenticate;