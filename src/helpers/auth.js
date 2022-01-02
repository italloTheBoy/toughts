module.exports.checkAuth = function auth(req, res, next) {
  if (!req.session.userId) {
    req.flash('error', 'Você precisa estar logado para acessar aquela página')

    return res.status(401).redirect('/login')
  }

  next()
}