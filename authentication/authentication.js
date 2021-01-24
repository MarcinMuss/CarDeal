function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}

function setIsAuthenticated(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated, setIsAuthenticated }