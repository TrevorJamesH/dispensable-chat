const express = require('express')
const path = require('path')
const db = require('./db/db')
const app = express()
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const {findById, findByUsername} = require('./db/passport')
require('dotenv').config()


app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({extended: false}))
app.use(require('body-parser').json())
app.use(session( { 
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  findById(id, function(err, user) {
    done(err, user)
  })
})

// passport.use('local-login', new LocalStrategy({
//   // by default, local strategy uses username and password, we will override with email
//   usernameField : 'username',
//   passwordField : 'password',
//   passReqToCallback : true // allows us to pass back the entire request to the callback
// }, function(req, username, password, done) { // callback with email and password from our form
//   // find a user whose email is the same as the forms email
//   // we are checking to see if the user trying to login already exists
//   findByUsername(username, function(err, user) {
//     // if there are any errors, return the error before anything else
//     if (err){
//       return done(err)
//     }

//     // if no user is found, return the message
//     if (!user){
//       return done(null, false, 'No user found.') // req.flash is the way to set flashdata using connect-flash
//     }

//     // if the user is found but the password is wrong
//     if (!user.validPassword(password)){
//       return done(null, false, 'Oops! Wrong password.') // create the loginMessage and save it to session as flashdata
//     }

//     // all is well, return successful user
//     return done(null, user)
//   })
// }))

// passport.use('local-signup', new LocalStrategy({
//   // by default, local strategy uses username and password, we will override with email
//   usernameField : 'username',
//   passwordField : 'password',
//   passReqToCallback : true // allows us to pass back the entire request to the callback
// }, function(req, username, password, done) {
//   // asynchronous
//   // User.findOne wont fire unless data is sent back
//   process.nextTick(function() {

//     // find a user whose email is the same as the forms email
//     // we are checking to see if the user trying to login already exists
//     findByUsername(username, function(err, user) {
//       // if there are any errors, return the error
//       if (err)
//         return done(err)
//       // check to see if theres already a user with that email
//       if (user) {
//         return done(null, false, 'That email is already taken.')
//       }
//     })
//   })
// }))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/stylesheets')))
app.use(express.static(path.join(__dirname, 'public/scripts')))

app.use('/', require('./routes/index'))(app, passport)
app.listen(3000)
