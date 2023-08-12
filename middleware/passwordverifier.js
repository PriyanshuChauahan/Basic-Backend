// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const User = require('../models/User');
const JWT_SECRET='Natureisourmother';

const passwordverifier=async (req,res,next)=>{
    // get the user from jwt token and aad id to req object

    const ftoken=req.header('forgot-password-token');
    // if token is not present then send error
    if(!ftoken)
    {
        return res.status(401).send({success:false,error:"Please authenticate using a valid  Password token"})

    }
    try{

        const data=jwt.verify(ftoken,JWT_SECRET);
        const user=await User.findById(data.user.id)
        if(user && !user.reset_password)
        {
            console.log("ji")
            return res.status(401).send({success:false,error:"Please authenticate using a valid  Password token"})
        }
        const token=await Token.findOne({userId:data.user.id});
        console.log(token)
        if(token &&  token.forgot_password_token)
        {
           
            if(token.forgot_password_token==ftoken)
            {
                req.user=data.user;
                console.log("fi");
                next();

            }
            else
            {
                console.log("hi");
                return res.status(401).send({error:"Please authenticate using a valid Email token"})
            }

        }
        else
        {
            
            console.log("ki");
                return res.status(401).send({error:"Please authenticate using a valid Password token"})

            
        }

    }
    catch(error)
    {
        console.log(error);
        return res.status(401).send({error:"Please authenticate using a valid Password token"})
    }


}

module.exports=passwordverifier;

// jwt.verify(token, 'ourSecretKey', function(err, decoded) {
//     if (err) {
//         console.log(err);
//         res.send("Email verification failed, 
//                 possibly the link is invalid or expired");
//     }
//     else {
//         res.send("Email verifified successfully");
//     }
// });