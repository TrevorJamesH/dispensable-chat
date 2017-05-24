const express = require('express')
const router = express.Router()
const {postChat, getAllChatsByRoom, getAllRooms} = require('../db/db')

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}

router.get('/', (req, res) => {
  res.render('landing')
})

router.get('/login', (req, res) => {
  res.json({redirectUrl: '/login/input'})
})

router.get('/login/input', (req, res) => {
  res.render('login')
})

router.post('/login/input', (req, res) => {
  res.sendStatus(200)
})

router.post('/logout', (req, res) => {
  res.logout()
  res.redirect('/')
})

router.get('/signup', (req, res) => {
  res.json({redirectUrl: '/signup/input'})
})

router.post('/signup', (req, res) => {
  res.sendStatus(200)
})

router.get('/signup/input', (req, res) => {
  res.render('signup')
})

router.get('/home', isLoggedIn, (req, res) => {
  isLoggedIn(req, res)
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
