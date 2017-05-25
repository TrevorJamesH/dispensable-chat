const bcrypt = require('bcrypt-nodejs')

const userSchema = {
  "generateHash": (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
  "validPassword": (password, comparePw) =>
    bcrypt.compareSync(comparePw, password)
}

module.exports = userSchema
