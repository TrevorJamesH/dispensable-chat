const express = require('express')
const router = express.Router()
const {postChat, unsubscribe, getAllChatsByRoom, getAllRooms, postRoom, getRoomsByUserId, addUserToRoom} = require('../db/db')
const {createUser} = require('../db/passport')

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

module.exports = function(app, passport) {
  router.get('/', (req, res) => {
    if(req.user) {
      res.redirect('/home/redirect')
    } else {
      res.render('landing')
    }
  })

  router.get('/login', (req, res) => {
    res.json({redirectUrl: '/login/input'})
  })

  router.get('/login/input', (req, res) => {
    res.render('login')
  })

  router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', {
      successRedirect: '/home/redirect',
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
      req.session.user_id = result.id
      req.session.username = req.body.username
      req.session.password = req.body.password
      res.cookie('user_id', result.id, { maxAge: (30*60*1000), httpOnly: false })
      res.status(200).send(result)
    })
  })

  router.get('/home/redirect', (req, res) => {
    res.cookie('user_id', req.session.user_id, { maxAge: (30*60*1000), httpOnly: false })
    res.redirect('/home')
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

  router.post('/postRoom', (req, res) => {
    postRoom(req.body.roomName)
    .then(response => {
      res.send(response)
    })
  })

  router.post('/postChat', (req, res) => {
    postChat(req.body.chat, req.body.room, req.body.user_id)
    .then(response => {
      res.send(response)
    })
  })

  router.post('/subscribeUser', (req, res) => {
    addUserToRoom(req.body.userId, req.body.roomId)
    .then(response => {
      res.send(response)
    })
  })

  router.post('/getRoomsByUserId', (req, res) => {
    getRoomsByUserId(req.body.user_id)
    .then(response => {
      res.send( response )
    })
  })

  router.post('/unsubscribe', (req, res) => {
    return unsubscribe(req.body.userId, req.body.roomId)
    .then( () => {
      res.sendStatus(204)
    })
  })

  router.get('/getAllRooms', (req, res) => {
    getAllRooms()
    .then(response => {
      res.send(response)
    })
  })

  router.post('/getAllChatsByRoom', (req, res) => {
    getAllChatsByRoom( req.body.roomId )
    .then(response => {
      res.send(response)
    })
  })

  router.get('/logout/redirect', (req, res) => {
    res.json({url:'/logout'})
  })

  router.get('/logout', (req,res) => {
    req.logout()
    req.session = null
    let cookie = req.cookies
    for (var prop in cookie) {
      if (!cookie.hasOwnProperty(prop)) {
        continue
      }
      res.cookie(prop, '', {expires: new Date(0)})
    }
    res.redirect('/')
  })

  return router
}
