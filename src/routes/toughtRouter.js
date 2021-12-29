const router = require('express').Router()
const toughtController = require('../controllers/toughtController')


// CREATE

// READ 
router.get('/', toughtController.readAll)

// UPDATE

// DELETE


module.exports = router