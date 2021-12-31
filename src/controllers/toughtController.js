const Tought = require('../models/Tought')
const User = require('../models/User')


module.exports = class toughtController {
  static async readAll(req, res) {
    res.render('tought/read')
  }
}