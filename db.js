const mongoose = require("mongoose");

const mongoURI = process.env.DB_URL;
// const mongoURI="mongodb://localhost:27017/test1"
// try{

const connectToMongo = async () => {
  //         await mongoose.connect(mongoURI, {
  //             useNewUrlParser: true,
  //             useUnifiedTopology: true
  //         });
  //         console.log("Connected to mongo successfully");
  //     }
  try {
    await mongoose.connect(
      mongoURI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true,
      },
      (error) => {
        if (error) return new Error("Failed to connect to database");
      }
      );
      console.log("connected to Mongo Successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToMongo;
