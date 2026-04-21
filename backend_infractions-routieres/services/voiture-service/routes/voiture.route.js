const express = require('express')
const { getAllVoitures, createVoiture, getVoitureById, updateVoiture, deleteVoiture } = require('../controller/voiture.controller')
const { validate, voitureValidation, paramIdValidation } = require('../../../middleware/validation.middleware')
const router = express.Router()

router.get('/', getAllVoitures)
router.post('/', voitureValidation, validate, createVoiture)
router.get('/:id', paramIdValidation, validate, getVoitureById)
router.post('/update-voiture/:id', paramIdValidation, voitureValidation, validate, updateVoiture)
router.post('/delete-voiture/:id', paramIdValidation, validate, deleteVoiture)

module.exports = router