const Knex = require('knex')
const knex = Knex(require('./knexfile.js').development)
const userSchema = require('./modals/user')

const createUser = (username, password) => {
  return knex
  .table('users')
  .insert({
    username: username,
    password: userSchema.generateHash(password)
  })
  .returning('*')
}

// const authenticatePassword = (username, password) => {
//   return knex
//   .table('users')
//   .where({
//     username: username
//   })
//   .select('*')
//   .then(result => {
//     userSchema.validPassword(password, result.password)
//     return result
//   })
// }

const findById = (id, callback) => {
  return knex
  .table('users')
  .where({
    id: id
  })
  .select()
  .then(result => {
    callback(null, result)
    return result
  })
}

const findByUsername = (username, callback) => {
  return knex
  .table('users')
  .where({
    username: username
  })
  .first()
  .then(row => {
    callback(null, row)
    return row
  })
}

module.exports = {
  createUser, findById, findByUsername
}
