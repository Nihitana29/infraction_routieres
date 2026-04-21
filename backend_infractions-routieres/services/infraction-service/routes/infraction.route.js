const express = require('express')
const { getAllInfractions, createInfraction, getInfractionById, updateInfraction, getInfractionsByVoiture, deleteInfraction } = require('../controller/infraction.controller')
const { validate, infractionValidation, paramIdValidation } = require('../../../middleware/validation.middleware')
const router = express.Router()

router.get('/', getAllInfractions)
router.post('/', infractionValidation, validate, createInfraction)
router.get('/:id', paramIdValidation, validate, getInfractionById)
router.get('/voiture/:id', paramIdValidation, validate, getInfractionsByVoiture)
router.post('/update-infraction/:id', paramIdValidation, infractionValidation, validate, updateInfraction)
router.post('/delete-infraction/:id', paramIdValidation, validate, deleteInfraction)

module.exports = router