const router = require('express').Router()
const toughtController = require('../controllers/toughtController')
const checkAuth = require('../helpers/auth').checkAuth


router.get('/', toughtController.readAll)
router.get('/dashboard', checkAuth, toughtController.dashboard)


module.exports = router