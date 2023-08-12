const express=require('express')
const router=express.Router();
const User=require('../models/User');
const {body,validationResult,matchedData}=require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const sending_verify_email=require("../Email/tokenSender");
const Token = require('../models/Token');
const emailverifier = require('../middleware/emailverifier');
const passwordverifier = require('../middleware/passwordverifier');

const JWT_SECRET='Natureisourmother';

// Store hash in your password DB.
// const {query,validationResult}=require('express-validator')



//Route 1:   Create a User using : POST "/api/auth/createuser" Does not require Auth No login Required
router.post('/createuser',
// validating data here
[
    body('email',"Enter a Valid Email").isEmail(),
    body('name',"Enter a Valid Name").isLength({min:3}),
    body('password',"Enter a Valid Password").isLength({min:5}),

],async (req,res)=>{
    // they are errors, Return Bad Request and the errors
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return  res.status(400).json({success, errors: errors.array() });
      
    }
    let rdata = matchedData(req);
    console.log(rdata);
    // try to catch error if something happen with db
    try{
        // check whether the user with same email exists already

    // finding user by email
    
    let user=await User.findOne({email : rdata.email});
    if(user)
    {
        return res.status(400).json({success,error:"Sorry User With this Email Id Already Exists"})
    }
  // creating user for storing in database

//   securing Password
//   generating salt
  const salt=await bcrypt.genSalt(10);
   // generating hash
  const secPass=await bcrypt.hash(rdata.password,salt);

   user=await User.create(
    {
        name: rdata.name,
        password:secPass,
        email:rdata.email
    })
    const data={
        user:{
            id:user.id

        }
    }
    const edata={
        user:{
            id:user.id,
            email:user.email
        }
    }
    const authtoken=jwt.sign(data,JWT_SECRET,{ expiresIn: '30m' });
    const email_verification_token=jwt.sign(edata,JWT_SECRET,{ expiresIn: '30m' });
   let token=await Token.create(
     {
        userId:user.id,
        auth_token:authtoken,
        email_verification_token:email_verification_token
     }
    )
    console.log("HI");
sending_verify_email(email_verification_token,rdata.email,0);
success=true;


// res.json({"msg":"User have been Successfull Created","user":user})
// res.json({success,authtoken,msg:"Verification  Email sent"});
return res.json({success,authtoken,msg:"Verification  Email sent"});
    
}
catch(error)
{
    // printing error 
    console.log(error.message,error);
    res.status(500).send("Internal Server  Ocurred")

}
})




//Route 2 :Verifying User Email  using : POST "/api/auth/login" Does not require Auth No login Required

router.post('/verify', emailverifier,async (req, res)=>{
    
   // database email_verified=true;
   // redirect  kar dena hai token bhejna hai
   try{
    const {auth_token,id}=req.user;
    
    const user=await User.findById(id).select("-password");
    if(!user.email_verified)
    {
       
        user.email_verified=true;
        user.save();

        return  res.status(200).json({success:true,auth_token,"msg":"Email Verification Successfull"})
    }
    else
    {
        return  res.status(400).json({success:false,"msg":"Email Already Verified "})

    }
    

}
catch(error)
{
    // printing error 
    console.log(error.message);
    res.status(500).send("Internal Server  Ocurred")

}
  
});



//Route 3 :Regenerating Verification  User Email  using : POST "/api/auth/send_email"    login Required

router.post('/resend_email', fetchuser,async (req, res)=>{
    
    // database email_verified=true;
    // redirect  kar dena hai token bhejna hai
    try{
     const userId=req.user.id;
     
     const user=await User.findById(userId).select("-password");
     if(user && !user.email_verified)
     {
       
        const edata={
            user:{
                id:user.id,
                email:user.email
            }
        }
        const email_verification_token=jwt.sign(edata,JWT_SECRET,{ expiresIn: '10m' });
       let token=await Token.findOne({userId:user.id});
       token.email_verification_token=email_verification_token;
       await token.save();
       sending_verify_email(email_verification_token,edata.email,0);

        success=true;
        
        
        // res.json({"msg":"User have been Successfull Created","user":user})
        // res.json({success,authtoken,msg:"Verification  Email sent"});
        res.json({success,msg:"Verification  Email sent"});
     }
     else
     {
         return  res.status(400).json({success:false,"msg":"Email Already Verified "})
 
     }
     
 
 }
 catch(error)
 {
     // printing error 
     console.log(error.message);
     res.status(500).send("Internal Server  Ocurred")
 
 }
   
 });



//Route 4 :Verifying User Email  using : POST "/api/auth/login" Does not require Auth No login Required

router.post('/reset-password', passwordverifier,body('password',"Enter a Valid Password").isLength({min:5}),async (req, res)=>{
    
   // database email_verified=true;
   // redirect  kar dena hai token bhejna hai
   try{
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return  res.status(400).json({success, errors: errors.array() });
      
    }
    const rdata = matchedData(req);
    console.log(rdata);
    const {id}=req.user;
    
    const user=await User.findById(id).select("-password");
    if(user.email_verified)
    {
        // securing Password
  // generating salt
  const salt=await bcrypt.genSalt(10);
  // generating hash
 const secPass=await bcrypt.hash(rdata.password,salt);
 user.password=secPass;
 user.reset_password=false;
 user.save()
       
        return  res.status(200).json({success:true,"msg":"Passsword Reset Successfull"})
    }
    else
    {
        return  res.status(400).json({success:false,"msg":"Please Verify Email First "})

    }
    

}
catch(error)
{
    // printing error 
    console.log(error.message);
    res.status(500).send("Internal Server  Ocurred")

}
  
});



//Route 5 :Regenerating Verification  User Email for Changing Password using : POST "/api/auth/send_email"    login Required

router.post('/forgot-password', fetchuser,async (req, res)=>{
    
    // database email_verified=true;
    // redirect  kar dena hai token bhejna hai
    try{
     const userId=req.user.id;
     
     const user=await User.findById(userId).select("-password");
     if(user && user.email_verified)
     {
       
        const fdata={
            user:{
                id:user.id,
                name:user.name
            }
        }
        user.reset_password=true;
        await user.save();
        const forgot_password_token=jwt.sign(fdata,JWT_SECRET,{ expiresIn: '10m' });
       let token=await Token.findOne({userId:user.id});
       token.forgot_password_token=forgot_password_token;
       console.log(user);
       console.log(token);
       await token.save();
       sending_verify_email(0,user.email,forgot_password_token);

        success=true;
        
        res.json({success,msg:"Password Reset  Email sent"});
     }
     else
     {
         return  res.status(400).json({success:false,"msg":"Please Verify Your Email First"})
 
     }
     
 
 }
 catch(error)
 {
     // printing error 
     console.log(error.message);
     res.status(500).send("Internal Server  Ocurred")
 
 }
   
 });









//Route 4 :Login User using : POST "/api/auth/login" Does not require Auth No login Required
router.post('/login',
// validating data here
[
    body('email',"Enter a Valid Email").isEmail(),
    body('password',"Cannot Be Blanked").exists(),

],async (req,res)=>{
    // they are errors, Return Bad Request and the errors
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return  res.status(400).json({ success,errors: errors.array() });
      
    }
    const rdata = matchedData(req);
    console.log(rdata);

    const {email,password}=rdata;

    // try to catch error if somethin happen with db
    try{
        // check whether the user with email exists or not in our db

    // finding user by email
    let user=await User.findOne({email :email});
    if(!user)
    {
        return res.status(400).json({success,error:"Please try to login with correct credentials"})
    }
  

  // checking Password
  const passwordCompare=await bcrypt.compare(password,user.password)
  if(!passwordCompare)
  {
   return  res.status(400).json(success,{error:"Please try to login with correct credentials"});
  }
  
    
  
  const data={
      user:{
        id:user.id
    }
}


const authtoken=jwt.sign(data,JWT_SECRET,{ expiresIn: '30m' });


let token=await Token.find({userId:user.id});
token=token[0];
token.auth_token=authtoken;
await token.save()


success=true;
if(!user.email_verified)
  {

      return  res.status(400).json({success,authtoken,"msg":"Please Verify Your Email First "})
  }
return res.json({success,authtoken});
    
   
}
catch(error)
{
    // printing error 
    console.log(error.message);
    res.status(500).send("Internal Server  Ocurred")

}
})



//Router 5 : Get Loggedin User Details using GET "/api/auth/login/getuser" Login Required
router.get('/getuser',fetchuser,async (req,res)=>{
   
    // try to catch error if somethin happen with db
try{
    const userId=req.user.id;
    
    const user=await User.findById(userId).select("-password");
    
   return  res.status(200).json({success:true,"userInfo":user})
    

}
catch(error)
{
    // printing error 
    console.log(error.message);
    res.status(500).send("Internal Server  Ocurred")

}
});


module.exports=router;