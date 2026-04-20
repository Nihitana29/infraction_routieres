const mongoose = require('mongoose')
const Infraction = require('./../../../models/infraction.model')

const reglerPaiement = async (req, res) => {
    try {
        const infractionId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(infractionId)) {
            return res.status(400).json({ message: "ID d'infraction invalide" })
        }
        const updateStatut = await Infraction.findByIdAndUpdate(infractionId, {statut: 'paye'}, {new: true})
        if (!updateStatut) {
            return res.status(404).json({ message: "Infraction non trouvée" })
        }
        return res.status(200).json(updateStatut)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors du traitement du paiement" })
    }
}

module.exports = reglerPaiement