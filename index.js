require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");

connectToMongo();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors(
  {
    credentials:true,
    origin:"http://localhost:3000",
  }
));
app.use(cookieParser());
app.use(express.json());



// Available Routes

app.use("/api/auth", require("./routes/auth.route"));
// app.use("/api/setting", async (req, res, next) => {
//      res.cookie("yu","90877");
//      res.send("Cookie settled")
 
// });
// for all non available routes
app.use(async (req, res, next) => {
  // const error=new Error("Not found");
  // error.status=404
  // next(error);
  next(createError.NotFound("This Route Does Not Exist"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(port, () => {
  console.log(
    `Template backend app listening on port http://localhost:${port}`
  );
});
