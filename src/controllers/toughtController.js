const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class toughtController {
  static readAll(req, res) {
    return res.render('tought/read')
  }

  static dashboard(req, res) {
    return res.status(200).render('tought/dashboard')
  }
}