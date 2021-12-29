const router = require('express').Router()
toughtController = require('../controllers/toughtController')


router.get('/', toughtController.readAll)




module.exports = router