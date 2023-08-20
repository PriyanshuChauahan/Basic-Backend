const express = require("express");
const router = express.Router();
const authValidator = require("../controllers/Validators/authValidator");
const authController = require("../controllers/Auth/authController");

const fetchuser = require("../middleware/fetchuser");

const emailverifier = require("../middleware/emailverifier");
const passwordverifier = require("../middleware/passwordverifier");

//Route 1:   Create a User using : POST "/api/auth/createuser" Does not require Auth No login Required
router.post(
  "/createuser",
  authValidator.validate("create_user"),
  authController.create_user
);

//Route 2 :Verifying User Email  using : POST "/api/auth/login" Does not require Auth No login Required

router.post("/verify", emailverifier, authController.verify_email);

//Route 3 :Regenerating Verification  User Email  using : POST "/api/auth/send_email"    login Required

router.post("/resend_email", fetchuser, authController.resend_email);

//Route 4 :Resetting Password   using : POST "/api/auth/login" Does not require Auth No login Required

router.post(
  "/reset-password",
  passwordverifier,
  authValidator.validate("reset_password"),
  authController.reset_password
);

//Route 5 : Verification   Email Sent for setting Password : POST "/api/auth/send_email"    login Required

router.post("/forgot-password", fetchuser, authController.forgot_password);

//Route 6 :Login User using : POST "/api/auth/login" Does not require Auth No login Required
router.post("/login", authValidator.validate("login"), authController.login);

//Router 7 : Get Loggedin User Details using GET "/api/auth/login/getuser" Login Required
router.get("/getuser", fetchuser, authController.fetch_user);

module.exports = router;
