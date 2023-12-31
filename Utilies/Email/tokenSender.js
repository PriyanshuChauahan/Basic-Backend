// const nodemailer = require('nodemailer');
// using for previewing email
const previewEmail = require("preview-email");

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: secure_configuration.EMAIL_USERNAME,
//         pass: secure_configuration.PASSWORD
//     }
// });

// <https://nodemailer.com/message/>

const sending_verify_email = (email_token, rec, password_token) => {
  if (password_token != 0) {
    const mailConfigurations = {
      // It should be a string of sender/server email
      from: "admin@gmail.com",

      to: rec,

      // Subject of Email
      subject: "Password Reset",

      // This would be the text of email body

      text: `Hi! There, You have forget Password
                 o
                 Please follow the given link to reset Password
                 http://localhost:5000/verify/${password_token} 
                 Thanks`,
    };
    previewEmail(mailConfigurations).then(console.log).catch(console.error);
  } else {
    const mailConfigurations = {
      // It should be a string of sender/server email
      from: "admin@gmail.com",

      to: rec,

      // Subject of Email
      subject: "Email Verification",

      // This would be the text of email body

      text: `Hi! There, You have recently visited 
    our website and entered your email.
               Please follow the given link to verify your email
               http://localhost:5000/verify/${email_token} 
               Thanks`,
    };
    previewEmail(mailConfigurations).then(console.log).catch(console.error);
  }
};

// use when sending real emails

// transporter.sendMail(mailConfigurations, function(error, info){
//     if (error) throw Error(error);
//     console.log('Email Sent Successfully');
//     console.log(info);
// });

module.exports = sending_verify_email;
