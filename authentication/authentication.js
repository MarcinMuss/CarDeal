function checkAuthenticated(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated()
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/log/login')
}

module.exports = { checkAuthenticated }