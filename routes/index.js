const express = require('express')
const router = express.Router()
const {postChat, getAllChatsByRoom, getAllRooms} = require('../db/db')

router.get('/', (req, res) => {
  res.sendFile(__dirname + 'landing')
})

router.post('/login', (req, res) => {
  res.json({redirectUrl: '/home'})
})

router.post('/signup', (req, res) => {
  res.sendStatus(200)
})

router.get('/home', (req, res) => {
  res.render('chatroom')
})

router.get('/favicon.ico', (req, res) => {
  res.sendStatus(204)
})

router.post('/postChat', (req, res) => {
  postChat(req.body.chat, req.body.room, req.body.user)
  .then(response => {
    res.send(response)
  })
})

router.get('/getAllRooms', (req, res) => {
  getAllRooms()
  .then(response => {
    res.send(response)
  })
})

router.get('/getAllChatsByRoom/:room', (req, res) => {
  getAllChatsByRoom( req.params.room )
  .then(response => {
    res.send(response)
  })
})

module.exports = router
