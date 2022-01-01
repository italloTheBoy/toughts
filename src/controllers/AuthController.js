const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class AuthController {
  static async login(req, res) {
    res.render('auth/login')
  }

  static async register(req, res) {
    res.render('auth/register')
  }

  static async registerPost(req, res) {
    const name = req.body.name.toLowerCase().trim()
    const email = req.body.email.toLowerCase().trim()
    const password = req.body.password.toLowerCase()
    const confirmPassword = req.body.confirmPassword.toLowerCase().trim()


    let err = false

    if (!name || name === '') {
      req.flash('nameErr', 'Insira um nome')
      err = true
    }

    if (!email || email === '') {
      req.flash('emailErr', 'Insira um email')
      err = true
    }
    else {
      await User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('emailErr', 'Email já cadastrado')
            err = true
          }
        })
        .catch(err => {
          console.log(err)
          return res.status(500).redirect('/500')
        })
    }

    if (!password || password === '') {
      req.flash('passwordErr', 'Insira uma senha')
      err = true
    }
    else if (password !== confirmPassword) {
      req.flash('passwordErr', 'As senhas não batem')
      err = true
    }

    if (err === true) return res.status(403).render('auth/register')

    const hash = await bcrypt.genSalt(15).then(salt => {
      return bcrypt.hash(password, salt)
    })

    try {
      const user = await User.create({
        name,
        email,
        password: hash,
      })
      
      req.session.userId = user.id
      
      req.flash('success', 'Usuário cadastrado com sucesso')
  
      req.session.save(() => {
        res.redirect('/')
      })
    
    } catch (err) {
      console.log(err)

      return res.status(500).redirect('/500')
    }
  }
}