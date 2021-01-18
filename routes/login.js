const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const router = express.Router()
const { checkAuthenticated } = require('../authentication/authentication')

const users = []

const initializePassport = require('../public/javascripts/passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)


router.get('/log', checkAuthenticated, (req, res) => {
    res.render('login/indexxx.ejs', { name: req.user.name })
})
  
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login/login.ejs')
})
  
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log/login',
    failureFlash: true
}))
  
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('login/register.ejs')
})
  
router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/log/login')
    } catch {
      res.redirect('/log/register')
    }
})
  
router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/log/login')
})
  
  
function checkNotAuthenticated(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated()
  if (req.isAuthenticated()) {
      return res.redirect('/log')
    }
    next()
}

module.exports = router