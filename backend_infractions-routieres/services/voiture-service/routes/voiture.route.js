const express = require('express')
const { getAllVoitures, createVoiture, getVoitureById, updateVoiture, deleteVoiture } = require('../controller/voiture.controller')
const router = express.Router()

router.get('/', getAllVoitures)
router.post('/', createVoiture)
router.get('/:id', getVoitureById)
router.post('/update-voiture/:id', updateVoiture)
router.post('/delete-voiture/:id', deleteVoiture)

module.exports = router