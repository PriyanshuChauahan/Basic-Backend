const express=require('express')
const router=express.Router();
const User=require('../models/User');
const {body,validationResult,matchedData}=require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

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
    const rdata = matchedData(req);
    console.log(rdata);
    // try to catch error if somethin happen with db
    try{
        // check whether the user with same email exists already

    // finding user by email
    let user=await User.findOne({email : req.body.email});
    if(user)
    {
        return res.status(400).json(success,{error:"Sorry User With this Email Id Already Exists"})
    }
  // creating user for storing in database

  // securing Password
  // generating salt
  const salt=await bcrypt.genSalt(10);
   // generating hash
  const secPass=await bcrypt.hash(req.body.password,salt);

   user=await User.create(
    {
        name: req.body.name,
        password:secPass,
        email:req.body.email
    }
   )
   const data={
    user:{
        id:user.id
    }
   }
const authtoken=jwt.sign(data,JWT_SECRET);
success=true;


// res.json({"msg":"User have been Successfull Created","user":user})
res.json({success,authtoken});
    
}
catch(error)
{
    // printing error 
    console.log(error.message);
    res.status(500).send("Internal Server  Ocurred")

}
})






//Route 2 :Login User using : POST "/api/auth/login" Does not require Auth No login Required
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

    const {email,password}=req.body;

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
const authtoken=jwt.sign(data,JWT_SECRET);
success=true;
res.json({success,authtoken});
    
   
}
catch(error)
{
    // printing error 
    console.log(error.message);
    res.status(500).send("Internal Server  Ocurred")

}
})



//Router 3 : Get Loggedin User Details using GET "/api/auth/login/getuser" Login Required
router.get('/getuser',fetchuser,async (req,res)=>{
   
    // try to catch error if somethin happen with db
try{
    const userId=req.user.id;
    
    const user=await User.findById(userId).select("-password");
   return  res.status(200).json({"msg":"success","userInfo":user})
    

}
catch(error)
{
    // printing error 
    console.log(error.message);
    res.status(500).send("Internal Server  Ocurred")

}
});


module.exports=router;