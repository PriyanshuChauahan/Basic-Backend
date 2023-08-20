const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

const connectToMongo = async () => {
  try {
    await mongoose
      .connect(mongoURI, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        autoIndex: true,
      })
      .then(() => {
        console.log("connected to MongoDB Successfully");
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (error) {
    console.log(error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Mongoose Connected to db");
});
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose Connection is  Disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = connectToMongo;
