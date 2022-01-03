const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class toughtController {

  static create(req, res) {
    return res.status(200).render('tought/create')
  }
  
  static async createPost(req, res) {
    const { tought } = req.body
    const userId = req.session.userId

    if (!tought || tought.trim() === '') {
      req.flash(
        'toughtErr', 
        'Insira um pensamento'
      )

      return req.session.save(() => {
        res.redirect('/tought/create')
      })
    }

    try {
      const user = await User.findByPk(userId)
      
      if (!user) {
        req.flash(
          'error',
          'Você precisa estar logado para acessar criar um pensamento'
        )

        return req.session.save(() => {
          res.status(401).redirect('/login')
        })
      }
        
      await Tought.create({
        tought: tought.trim(),
        userId,
      })

      return res.redirect('/tought/dashboard')

    }
    catch (err) {
      console.log(err)

      return res.status(500).render('error/500')
    }
  }

  static readAll(req, res) {
    return res.render('tought/read')
  }

  static dashboard(req, res) {
    return res.status(200).render('tought/dashboard')
  }
}