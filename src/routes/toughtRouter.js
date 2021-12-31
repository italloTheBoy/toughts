const router = require('express').Router()
const toughtController = require('../controllers/toughtController')


router.get('/', toughtController.readAll)


module.exports = router