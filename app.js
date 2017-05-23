const express = require('express')
const path = require('path')
const db = require('./db/db')
const app = express()
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config()

const index = require('./routes/index')

app.use('/', index)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(session( { 
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/stylesheets')))
app.use(express.static(path.join(__dirname, 'public/scripts')))

// views

app.listen(3000)
