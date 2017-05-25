const express = require('express')
const router = express.Router()
const {postChat, getAllChatsByRoom, getAllRooms} = require('../db/db')
const {createUser, authenticatePassword} = require('../db/passport')

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

module.exports = function(app, passport) {
  router.get('/', (req, res) => {
    res.render('landing')
  })

  router.get('/login', (req, res) => {
    res.json({redirectUrl: '/login/input'})
  })

  router.get('/login/input', (req, res) => {
    res.render('login')
  })

  router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', {
      successRedirect: '/home',
      failureRedirect: '/login/input'
    })(req, res, next)
  })

  router.post('/logout', (req, res) => {
    res.logout()
    res.redirect('/')
  })

  router.get('/signup', (req, res) => {
    res.json({redirectUrl: '/signup/input'})
  })

  router.post('/signup', (req, res) => {
    createUser(req.body.username, req.body.password)
    .then( result => {
      res.status(200).send(result)
    })
  })

  // router.post('/signup', (req, res, next) => {
  //   console.log('Ive been posted')
  //   passport.authenticate('local-signup', {
  //     successRedirect : '/home',
  //     failureRedirect : '/signup/input'
  //   })(req, res, next)
  // })

  router.get('/signup/input', (req, res) => {
    res.render('signup')
  })

  router.get('/home', isLoggedIn, (req, res, next) => {
    isLoggedIn(req, res, next)
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

  return router
}
