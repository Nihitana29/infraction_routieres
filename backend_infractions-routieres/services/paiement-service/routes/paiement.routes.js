const express = require('express')
const reglerPaiement = require('../controller/paiement.controller')
const { validate, paramIdValidation } = require('../../../middleware/validation.middleware')
const router = express.Router()

router.post('/:id', paramIdValidation, validate, reglerPaiement)

module.exports = router