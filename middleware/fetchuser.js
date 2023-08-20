const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Token = require("../models/Token.model");
const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = async (req, res, next) => {
  // get the user from jwt token and aad id to req object

  const authtoken = req.header("auth-token");

  // if token is not present then send error
  if (!authtoken) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(authtoken, JWT_SECRET);
    req.user = data.user;
    let user = await User.findById(req.user.id);
    let token = await Token.findOne({ userId: req.user.id });
    console.log(token);
    if (token && token.auth_token == authtoken) {
      if (req.url.slice(-12) == "resend_email") {
        next();
      } else if (user && user.email_verified) {
        next();
      } else {
        return res
          .status(401)
          .send({ success: false, error: "Please Verify Your Email First" });
      }
    } else {
      return res
        .status(401)
        .send({
          success: false,
          error: "Please authenticate using a valid token",
        });
    }
  } catch (error) {
    return res
      .status(401)
      .send({
        success: false,
        error: "Please authenticate using a valid token",
      });
  }
};

module.exports = fetchuser;
