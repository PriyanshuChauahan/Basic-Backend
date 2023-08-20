const jwt = require("jsonwebtoken");
const Token = require("../models/Token.model");
const User = require("../models/User.model");
const JWT_SECRET = process.env.JWT_SECRET;

const emailverifier = async (req, res, next) => {
  // get the user from jwt token and aad id to req object

  const etoken = req.header("email-auth-token");

  // if token is not present then send error
  console.log(etoken);
  if (etoken == undefined) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid Email token" });
  }
  try {
    const data = jwt.verify(etoken, JWT_SECRET);

    const token = await Token.find({ userId: data.user.id });

    console.log(token[0].email_verification_token);
    if (token && token[0].email_verification_token) {
      if (token[0].email_verification_token == etoken) {
        data.user.auth_token = token[0].auth_token;

        req.user = data.user;

        next();
      } else {
        return res
          .status(401)
          .send({ error: "Please authenticate using a valid Email token" });
      }
    } else {
      const user = await User.findById(data.user.id);
      if (user && user.email_verified) {
        return res.status(401).send({ error: "Email Already Verified" });
      } else {
        return res
          .status(401)
          .send({ error: "Please authenticate using a valid Email token" });
      }
    }
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid Email token" });
  }
};

module.exports = emailverifier;
