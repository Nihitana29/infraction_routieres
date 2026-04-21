const Infraction = require('./../../../models/infraction.model')

const reglerPaiement = async (req, res, next) => {
    try {
        const infractionId = req.params.id
        const updateStatut = await Infraction.findByIdAndUpdate(infractionId, {statut: 'paye'}, {new: true})
        if (!updateStatut) {
            return res.status(404).json({ message: "Infraction non trouvée" })
        }
        return res.status(200).json(updateStatut)
    } catch (error) {
        next(error)
    }
}

module.exports = reglerPaiement