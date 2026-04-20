const mongoose = require('mongoose')
const Infraction = require('./../../../models/infraction.model')
const Voiture = require('./../../../models/voiture.model')

const createInfraction = async (req, res) => {
    try {
        const { plaque, type, montant, statut } = req.body;
        const voiture = await Voiture.findOne({ plaque })
        if(!voiture) {
            return res.status(404).json({ message: "Voiture non trouvée" })
        }
        const saveInfraction = await Infraction.create({
            voiture: voiture._id,
            type,
            montant,
            statut
        })
        return res.status(201).json(saveInfraction)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Une erreur interne est survenue" })
    }
}

const getAllInfractions = async (req, res) => {
    try {
        const infractions = await Infraction.find().populate('voiture')
        return res.status(200).json(infractions)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Impossible de récupérer les infractions" })
    }
}

const getInfractionById = async (req, res) => {
    try {
        const infractionId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(infractionId)) {
            return res.status(400).json({ message: "ID d'infraction invalide" })
        }
        const infraction = await Infraction.findById(infractionId).populate('voiture')
        if (!infraction) {
            return res.status(404).json({ message: "Infraction non trouvée" })
        }
        return res.status(200).json(infraction)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la récupération de l'infraction" })
    }
}

const getInfractionsByVoiture = async (req, res) => {
    try {
        const voitureId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(voitureId)) {
            return res.status(400).json({ message: "ID de véhicule invalide" })
        }
        const voiture = await Voiture.findById(voitureId)
        if (!voiture) {
            return res.status(404).json({ message: "Voiture non trouvée" })
        }
        const infractions = await Infraction.find({ voiture: voitureId }).populate('voiture')
        return res.status(200).json({
            voiture, 
            infractions
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la récupération des infractions par véhicule" })
    }
}

const updateInfraction = async (req, res) => {
    try {
        const { plaque, type, montant, statut } = req.body;
        const voiture = await Voiture.findOne({ plaque })
        if(!voiture) {
            return res.status(404).json({ message: "Voiture non trouvée" })
        }
        const infractionId = req.params.id 
        if (!mongoose.Types.ObjectId.isValid(infractionId)) {
            return res.status(400).json({ message: "ID d'infraction invalide" })
        }
        const update = await Infraction.findByIdAndUpdate(infractionId, {
            voiture: voiture._id,
            type,
            montant,
            statut
        }, {new: true})
        if (!update) {
            return res.status(404).json({ message: "Infraction non trouvée" })
        }
        return res.status(200).json(update)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la mise à jour" })
    }
}

const deleteInfraction = async (req, res) => {
    try {
        const infractionId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(infractionId)) {
            return res.status(400).json({ message: "ID d'infraction invalide" })
        }
        const deleted = await Infraction.findByIdAndDelete(infractionId)
        if (!deleted) {
            return res.status(404).json({ message: "Infraction non trouvée" })
        }
        return res.status(200).json({message: "Infraction supprimée"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la suppression" })
    }
}

module.exports = {
    createInfraction,
    getAllInfractions,
    getInfractionsByVoiture,
    getInfractionById,
    updateInfraction,
    deleteInfraction
}