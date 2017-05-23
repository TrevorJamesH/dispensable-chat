const express = require('express')
const router = express.Router()
const {postChat, getAllChatsByRoom, getAllRooms} = require('../db/db')

router.get('/', (req, res) => {
  res.render('landing')
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

router.get('/postChat', (req, res) => {
  postChat('sample', 'user', 'grumpy cat')
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

module.exports = router
