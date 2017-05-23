const express = require('express')
const path = require('path')
const db = require('./db/db')
const app = express()

const index = require('./routes/index')

app.use('/', index)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/stylesheets')))
app.use(express.static(path.join(__dirname, 'public/scripts')))

// views

app.listen(3000)
