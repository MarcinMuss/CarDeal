const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const router = express.Router()
const { checkNotAuthenticated } = require('../authentication/authentication')

const User = require('../models/user')

const initializePassport = require('../public/javascripts/passport-config')
initializePassport(
  passport,
  async email => await User.findOne({ email: email }),
  id => User.findById(id)
)


// router.get('/', checkAuthenticated, (req, res) => {
//     res.render('login/logout.ejs', { name: req.user.name })
// })
  
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login/login.ejs')
})
  
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
  
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('login/register.ejs')
})
  
router.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const existingUser = await User.findOne({email: req.body.email})
    if (existingUser) {
      res.render('login/register', {
        errorMessage: 'email already registered'
      })
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = new User({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });
      user.save();
      console.log(user);
      res.redirect('/login')
    }
  } catch {
    res.redirect('/register')
  }
})


router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})


module.exports = router