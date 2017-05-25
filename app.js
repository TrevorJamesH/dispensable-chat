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
const userSchema = require('./db/modals/user')
require('dotenv').config()


app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

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

passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback : true, // allows us to pass back the entire request to the callback
  session: true
}, function(req, username, password, done) { 
  console.log('I\'ve gotten here 1')
  findByUsername(username, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err){
      console.log('In 4 I had an error', err)
      return done(err)
    }

    // if no user is found, return the message
    if (!user){
      console.log('In 4 dont have a user')
      return done(null, false, 'No user found.') // req.flash is the way to set flashdata using connect-flash
    }

    // if the user is found but the password is wrong
    console.log('user:', user, 'password:', password)
    const logMeValue = userSchema.validPassword(user.password, password)
    console.log(logMeValue)
    if (!logMeValue){
      console.log('In 4 Its a bad password')
      return done(null, false, 'Oops! Wrong password.') // create the loginMessage and save it to session as flashdata
    }
    console.log('end if 3')

    // all is well, return successful user
    console.log('returning done:', done, 'user: ', user)
    return done(null, user)
  })
}))

passport.use('local-signup', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback : true, // allows us to pass back the entire request to the callback
  session: true
}, function(req, username, password, done) {
  // asynchronous
  // User.findOne wont fire unless data is sent back
  process.nextTick(function() {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    findByUsername(username, function(err, user) {
      // if there are any errors, return the error
      if (err)
        return done(err)
      // check to see if theres already a user with that email
      if (user) {
        return done(null, false, 'That email is already taken.')
      }
    })
  })
}))

// app.post('/login', passport.authenticate('local-login', {
//   successRedirect : '/home', // redirect to the secure profile section
//   failureRedirect : '/login/input', // redirect back to the signup page if there is an error
// }))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/stylesheets')))
app.use(express.static(path.join(__dirname, 'public/scripts')))

app.use('/', require('./routes/index')(app, passport))
app.listen(3000)
