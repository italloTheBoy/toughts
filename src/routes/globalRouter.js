const router = require('express').Router()
ToughtController = require('../controllers/toughtController')
GlobalController = require('../controllers/GlobalController')


router.get('/', ToughtController.readAll)

router.get('/500', GlobalController.serverError)
router.get('/404', GlobalController.notFound)


module.exports = router