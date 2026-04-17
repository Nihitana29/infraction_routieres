const express = require('express')
const reglerPaiement = require('../controller/paiement.controller')
const router = express.Router()

router.post('/:id', reglerPaiement)

module.exports = router