const express = require('express')
const path = require('path')
const db = require('./db/db')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const bodyParser = require('body-parser')

io.on('connection', function(socket) {
  console.log('helloooo is this working??')
  socket.on('disconnect', function() {
    console.log('user disconnect')
  })
  socket.on('chat message', function(msg) {
    io.emit('message',  msg)
  })
})

// http.listen(3001, function() {
//   console.log('testinggggg')
// })

app.use(bodyParser.json())

const index = require('./routes/index')

app.use('/', index)
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public/stylesheets')))
app.use(express.static(path.join(__dirname, 'public/scripts')))
app.use(express.static(path.join(__dirname, 'public/images')))


// views

server.listen(3000)
