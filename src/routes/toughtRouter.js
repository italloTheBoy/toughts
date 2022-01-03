const router = require('express').Router()
const toughtController = require('../controllers/toughtController')
const checkAuth = require('../helpers/auth').checkAuth


router.get('/', toughtController.readAll)
router.get('/dashboard', toughtController.dashboard)

router.get('/create', checkAuth, toughtController.create)
router.post('/create', checkAuth, toughtController.createPost)


module.exports = router