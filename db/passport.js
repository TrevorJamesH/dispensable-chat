const Knex = require('knex')
const env = 'development'
const knex = Knex(require('./knexfile.js').development)
const userSchema = require('./modals/user')
const passport = require('passport')
const passportLocal = require('passport-local')

const createUser = (username, password) => {
  return knex
  .table('users')
  .insert({
    username: username,
    password: userSchema.generateHash(password)
  })
  .returning('*')
}

const authenticatePassword = (username, password) => {
  return knex
  .table('users')
  .where({
    username: username
  })
  .select('*')
  .then(result => {
    console.log(userSchema.validPassword(password, result.password))
    return result
  })
}

const findById = (id, callback) => {
  return knex
  .table('users')
  .where({
    id: id
  })
  .select()
  .then(result => {
    console.log('I\'ve gotten here 2')
    return callback(null, result)
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
    console.log('I\'ve gotten here 3')
    callback(null, row)
  })
}

module.exports = {
  createUser, authenticatePassword, findById, findByUsername
}
