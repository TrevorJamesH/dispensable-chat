/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */


const express = require('express')
const path = require('path')
const app = express()
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const {findById, findByUsername, createUser} = require('./db/passport')
const userSchema = require('./db/modals/user')
require('dotenv').config()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', function(socket) {
  console.log('server connected')
  socket.on('disconnect', function() {
    console.log('user disconnect')
  })
  socket.on('chat message', function(msg) {
    console.log('server recieved message')
    socket.broadcast.emit('get messages',  msg)
  })
})

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.text())
app.use(bodyParser.urlencoded({extended: false}))


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

    req.session.user_id = user.id
    req.session.username = username
    req.session.password = password
    console.log('session:', req.session)

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
      var returnValue = createUser(username, password)
      return done(null, returnValue)
    })
  })
}))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/stylesheets')))
app.use(express.static(path.join(__dirname, 'public/scripts')))
app.use(express.static(path.join(__dirname, 'public/images')))


app.use('/', require('./routes/index')(app, passport))
server.listen(3000)
