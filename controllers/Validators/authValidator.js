const { body } = require('express-validator')
exports.validate = (method) => {
switch (method) {
    case 'create_user': {
     return [
        body("email", "Enter a Valid Email").toLowerCase().isEmail(),
        body("name", "Enter a Valid Name").isLength({ min: 3 }),
        body("password", "Enter a Valid Password").isLength({ min: 5 }),
      ] 
    }
    case 'reset_password':{
        return [
            body("password", "Enter a Valid Password").isLength({ min: 5 })
        ]
    }
    case 'login':{
       return [
            body("email", "Enter a Valid Email").isEmail(),
            body("password", "Cannot Be Blanked").exists(),
          ]
    }
  }
}