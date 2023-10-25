const jwt = require("jsonwebtoken");
const Token = require("../models/Token.model");
const User = require("../models/User.model");
const JWT_SECRET = process.env.JWT_SECRET;

const passwordverifier = async (req, res, next) => {
  // get the user from jwt token and aad id to req object

  const ftoken = req.headers["forgot_password_token"];
 
  // if token is not present then send error
  if (ftoken==undefined) {
    return res
      .status(401)
      .send({
        success: false,
        error: "Please authenticate using a valid  Password token",
      });
  }
  try {
    const data = jwt.verify(ftoken, JWT_SECRET);
    const user = await User.findById(data.user.id);
    if (user && !user.reset_password) {
      return res
        .status(401)
        .send({
          success: false,
          error: "Please Authenticate using a valid  Password token",
        });
    }
    const token = await Token.findOne({ userId: data.user.id });

    if (token && token.forgot_password_token) {
      if (token.forgot_password_token == ftoken) {
        req.user = data.user;

        next();
      } else {
        return res
          .status(401)
          .send({ error: "Please Authenticate using a valid Email token" });
      }
    } else {
      return res
        .status(401)
        .send({ error: "Please Authenticate using a valid Password token" });
    }
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please Authenticate using a valid Password token" });
  }
};

module.exports = passwordverifier;
