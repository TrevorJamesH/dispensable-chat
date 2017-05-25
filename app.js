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

passport.deserializeUser(function(id, done) {
  findById(id, function(err, user) {
    done(err, user)
  })
})

passport.use('local-login', new LocalStrategy({
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback : true, 
  session: true
}, (req, username, password, done) => { 
  findByUsername(username, function(err, user) {
    if (err){
      return done(err)
    }

    if (!user){
      return done(null, false, 'No user found.')
    }

    if (!userSchema.validPassword(user.password, password)){
      return done(null, false, 'Oops! Wrong password.')
    }

    return done(null, user)
  })
}))

passport.use('local-signup', new LocalStrategy({
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback : true,
  session: true
}, (req, username, password, done) => {
  process.nextTick(() => {
    findByUsername(username, (err, user) => {
      if (err)
        return done(err)
      if (user) {
        return done(null, false, 'That email is already taken.')
      }
    })
  })
}))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/stylesheets')))
app.use(express.static(path.join(__dirname, 'public/scripts')))

app.use('/', require('./routes/index')(app, passport))
app.listen(3000)
