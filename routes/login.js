const express = require('express')
const passport = require('passport')
const router = express.Router()


router.get('/log', checkAuthenticated, (req, res) => {
    res.render('indexxx.ejs', { name: req.user.name })
})
  
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
  
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/log',
    failureRedirect: '/login',
    failureFlash: true
}))
  
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
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
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
})
  
router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})
  
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
}
  
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/log')
    }
    next()
}

module.exports = router