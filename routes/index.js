const express = require('express')
const router = express.Router()

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
  res.render('chatroom',{
    roomList: [
      {
        name: 'Dog Party'
      },
      {
        name: 'Grumpy Cat'
      }
    ]
  })
})

router.get('/favicon.ico', (req, res) => {
  res.sendStatus(204)
})

module.exports = router
