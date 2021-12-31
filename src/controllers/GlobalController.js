module.exports = class GlobalController {
  static async serverError(req, res) {
    res.status(500).render('global/serverError')
  }

  static async notFound(req, res) {
    res.status(404).render('global/notFound')
  }
}