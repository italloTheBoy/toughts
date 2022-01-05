const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = class AuthController {
  
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
    
    if (err === true) {
      return res.status(403).render('auth/register', {
        name,
        email,
      }) 
    }
    
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

  static async login(req, res) {
    res.render('auth/login')
  }
  
  static async loginPost(req, res) {
    const email = req.body.email.toLowerCase().trim()
    const password = req.body.password.toLowerCase()

    let err = false

    if (!email || email === '') {
      req.flash('emailErr', 'Insira um email')
      err = true
    }

    if (!password || password === '') {
      req.flash('passwordErr', 'Insira uma senha')
      err = true
    }

    if (err === true) {
      return res.status(403).render('auth/login', {
        email,
        password,
      })
    }

    function existsErr() {
      req.flash('error', 'Email ou senha incorretos')
      return res.status(403).render('auth/login', {
        email,
        password,
      })
    }

    await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'password'],
      raw: true,
    })

    .then(user => {
      if (!user) {
        return existsErr()
      }

      const isMatch = bcrypt.compareSync(password, user.password)

      if (!isMatch) {
        return existsErr()
      }

      req.session.userId = user.id

      req.session.save(() => {
        res.redirect('/')
      })
    })

    .catch(err => {
      console.log(err)
      return res.status(500).redirect('/500')
    }) 
  }
  
  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login')
    })
  }
}