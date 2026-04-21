const express = require('express')
const { getAllVoitures, createVoiture, getVoitureById, updateVoiture, deleteVoiture } = require('../controller/voiture.controller')
const { validate, voitureValidation } = require('../../../middleware/validation.middleware')
const router = express.Router()

router.get('/', getAllVoitures)
router.post('/', voitureValidation, validate, createVoiture)
router.get('/:id', getVoitureById)
router.post('/update-voiture/:id', voitureValidation, validate, updateVoiture)
router.post('/delete-voiture/:id', deleteVoiture)

module.exports = router