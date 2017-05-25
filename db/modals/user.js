// app/models/user.js
// load the things we need
var bcrypt   = require('bcrypt-nodejs');

const userSchema = {}

userSchema.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.validPassword = function(password, comparePw) {
  console.log('in validate:', password, ', ', comparePw)
  return bcrypt.compareSync(comparePw, password);
};

// create the model for users and expose it to our app
module.exports = userSchema
