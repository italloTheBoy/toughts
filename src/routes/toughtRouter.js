const router = require('express').Router()
const toughtController = require('../controllers/toughtController')
const checkAuth = require('../helpers/auth').checkAuth


router.get('/create', checkAuth, toughtController.create)
router.post('/create', checkAuth, toughtController.createPost)

router.get('/', toughtController.readAll)
router.post('/search', toughtController.readWithSearch)
router.get('/dashboard', checkAuth, toughtController.readMyToughts)

router.get('/update/:id', checkAuth, toughtController.updateTought)
router.post('/update', checkAuth, toughtController.updateToughtPost)

router.post('/delete', checkAuth, toughtController.deleteTought)


module.exports = router