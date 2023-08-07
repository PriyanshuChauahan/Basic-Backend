// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET='Natureisourmother';

const fetchuser=(req,res,next)=>{
    // get the user from jwt token and aad id to req object

    const token=req.header('auth-token');
    // if token is not present then send error
    if(!token)
    {
        return res.status(401).send({error:"Please authenticate using a valid token"})

    }
    try{

        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    }
    catch(error)
    {
        return res.status(401).send({error:"Please authenticate using a valid token"})
    }


}

module.exports=fetchuser;
