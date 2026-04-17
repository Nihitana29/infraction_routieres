const express = require('express')
const { getAllInfractions, createInfraction, getInfractionById, updateInfraction, getInfractionsByVoiture, deleteInfraction } = require('../controller/infraction.controller')
const router = express.Router()

router.get('/', getAllInfractions)
router.post('/', createInfraction)
router.get('/:id', getInfractionById)
router.get('/voiture/:id', getInfractionsByVoiture)
router.post('/update-infraction/:id', updateInfraction)
router.post('/delete-infraction/:id', deleteInfraction)

module.exports = router