const mongoose =require('mongoose');


const mongoURI="mongodb://localhost:27017/test"

const connectToMongo= async ()=>{
   
   await mongoose.connect(mongoURI, {
       useNewUrlParser: true,
       useUnifiedTopology: true
    });
    console.log("Connected to mongo successfully");

}


module.exports=connectToMongo;