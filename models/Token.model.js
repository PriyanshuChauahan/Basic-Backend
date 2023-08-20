const mongoose = require("mongoose");
const { Schema } = mongoose;

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  auth_token: {
    type: String,
    required: true,
  },
  email_verification_token: {
    type: String,
    expires: "10m",
    default: null,
    index: true,
  },
  forgot_password_token: {
    type: String,
    expires: "10m",
    default: null,
    index: true,
  },
});
const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;
