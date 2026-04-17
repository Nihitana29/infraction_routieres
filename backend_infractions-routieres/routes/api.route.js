const express = require('express')
const router = express.Router()

router.use('/voitures', require('./../services/voiture-service/routes/voiture.route'))
router.use('/infractions', require('./../services/infraction-service/routes/infraction.route'))
router.use('/paiement', require('./../services/paiement-service/routes/paiement.routes'))

module.exports = router