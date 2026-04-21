const express = require('express')
const { getAllInfractions, createInfraction, getInfractionById, updateInfraction, getInfractionsByVoiture, deleteInfraction } = require('../controller/infraction.controller')
const { validate, infractionValidation } = require('../../../middleware/validation.middleware')
const router = express.Router()

router.get('/', getAllInfractions)
router.post('/', infractionValidation, validate, createInfraction)
router.get('/:id', getInfractionById)
router.get('/voiture/:id', getInfractionsByVoiture)
router.post('/update-infraction/:id', infractionValidation, validate, updateInfraction)
router.post('/delete-infraction/:id', deleteInfraction)

module.exports = router