const Infraction = require('./../../../models/infraction.model')

const reglerPaiement = async (req, res) => {
    try {
        const infractionId = req.params.id
        const updateStatut = await Infraction.findByIdAndUpdate(infractionId, {statut: 'paye'}, {new: true})
        return res.status(200).json(updateStatut)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

module.exports = reglerPaiement