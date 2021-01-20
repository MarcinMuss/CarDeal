function checkAuthenticated(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated()
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated()
  if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}

module.exports = { checkAuthenticated, checkNotAuthenticated }