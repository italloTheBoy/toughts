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
          'Você precisa estar logado para criar um pensamento'
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
      return res.status(500).redirect('/500')
    }
  }

  static readAll(req, res) {
    return res.render('tought/read')
  }

  static async readMyToughts(req, res) {
    const { userId } = req.session

    try {
      let status = 200

      const user = await User.findByPk(userId, { 
        include: Tought,
        plain: true,
      })
  
      if (!user) {
        req.flash(
          'error',
          'Você precisa estar logado para acessar o dashboard'
        )

        return req.session.save(() => {
          res.status(401).redirect('/login')
        })
      }

      const tought = user.toughts.map( 
        tought => tought.dataValues 
      )

      if (tought.length == 0) {
        status = 404
      }

      return res.status(status).render('tought/dashboard', { tought })
    }
    catch (err) {
      console.log(err)
      return res.status(500).redirect('/500')
    }
  }

  static async updateTought(req, res) {
    const { id } = req.params 
    const userId = req.session.userId
    let status = 200
    
    try {
      const tought = await Tought.findByPk(id, {
        raw: true,
        attributes: ['id', 'tought', 'userId']
      }) 

      if (!tought) {
        req.flash(
          'error',
          'Pensamento não encontrado.'
        )

        status = 404
      }

      else if (tought.userId !== userId) {
        req.flash(
          'error',
          'Você não pode editar este pensamento.'
        )

        status = 401
      }


      if (status !== 200) {
        return req.session.save(() => {
          res.status(status).redirect('/tought/dashboard')
        })
      }

      return res.status(status).render('tought/update', { tought })
    }
    catch (err) {
      console.log(err)
      return res.status(500).redirect('/500')
    }
  }

  static async updateToughtPost(req, res) {
    const { id, tought } = req.body 
    const userId = req.session.userId
    let status = 200
    
    try {
      const targetTought = await Tought.findByPk(id, {
        raw: true,
        attributes: ['tought', 'userId']
      }) 

      if (!targetTought) {
        req.flash(
          'error',
          'Pensamento não encontrado.'
        )

        status = 404
      }
      else if (targetTought.userId !== userId) {
        req.flash(
          'error',
          'Você não pode editar este pensamento.'
        )

        status = 401
      }
      else if (!tought || tought.trim() === '') {
        req.flash(
          'toughtErr',
          'Insira um pensamento'
        )

        status = 403
      }
      else {
        Tought.update({
          tought: tought.trim(),
        }, { where: { id } }) 

        req.flash(
          'success',
          'Pensamento atualizado'
        )
      }


      return req.session.save(() => {
        if (status === 403) {
          res.status(status).render('tought/update', { 
            tought: {
              id,
              tought,
            }
          })
        }
        else {
          res.status(status).redirect('/tought/dashboard')
        }
      })

    }
    catch (err) {
      console.log(err)
      return res.status(500).redirect('/500')
    }
  }

  static async deleteTought(req, res) {
    const { id } = req.body 
    const userId = req.session.userId
    
    try {
      const tought = await Tought.findByPk(id)
      let status = 200

      if (!tought) {
        req.flash(
          'error',
          'Pensamento não encontrado'
        )

        status = 404
      }

      else if (tought.userId !== userId) {
        req.flash(
          'error',
          'Você não pode deletar este pensamento'
        )

        status = 401
      }

      else {
        await tought.destroy()

        req.flash(
          'success',
          'Pensamento deletado'
        )
      } 
      
      return req.session.save(() => {
        res.status(status).redirect('/tought/dashboard')
      })
    }
    
    catch (err) {
      console.log(err)
      return res.status(500).redirect('/500')
    }
  }
}