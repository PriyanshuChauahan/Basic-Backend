require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");

connectToMongo();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use(cookieParser());

// Available Routes

app.use("/api/auth", require("./routes/auth.route"));

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
