const mongoose = require('mongoose')
const Voiture = require('./../../../models/voiture.model')

const createVoiture = async (req, res) => {
    try {
        const { plaque, marque, modele, proprietaire } = req.body;
        const saveVoiture = await Voiture.create({ plaque, marque, modele, proprietaire })
        return res.status(201).json(saveVoiture)
    } catch (error) {
        /* handled by global error handler or ignored */
        return res.status(500).json({ message: "Erreur lors de la création du véhicule" })
    }
}

const getAllVoitures = async (req, res) => {
    try {
        const voitures = await Voiture.find()
        return res.status(200).json(voitures)
    } catch (error) {
        /* handled by global error handler or ignored */
        return res.status(500).json({ message: "Impossible de récupérer les véhicules" })
    }
}

const getVoitureById = async (req, res) => {
    try {
        const voitureId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(voitureId)) {
            return res.status(400).json({ message: "ID de véhicule invalide" })
        }
        const voiture = await Voiture.findById(voitureId)
        if (!voiture) {
            return res.status(404).json({ message: "Véhicule non trouvé" })
        }
        return res.status(200).json(voiture)
    } catch (error) {
        /* handled by global error handler or ignored */
        return res.status(500).json({ message: "Erreur lors de la récupération du véhicule" })
    }
}

const updateVoiture = async (req, res) => {
    try {
        const voitureId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(voitureId)) {
            return res.status(400).json({ message: "ID de véhicule invalide" })
        }
        const { plaque, marque, modele, proprietaire } = req.body;
        const update = await Voiture.findByIdAndUpdate(voitureId, { plaque, marque, modele, proprietaire }, {new: true})
        if (!update) {
            return res.status(404).json({ message: "Véhicule non trouvé" })
        }
        return res.status(200).json(update)
    } catch (error) {
        /* handled by global error handler or ignored */
        return res.status(500).json({ message: "Erreur lors de la mise à jour" })
    }
}

const deleteVoiture = async (req, res) => {
    try {
        const voitureId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(voitureId)) {
            return res.status(400).json({ message: "ID de véhicule invalide" })
        }
        const deleted = await Voiture.findByIdAndDelete(voitureId)
        if (!deleted) {
            return res.status(404).json({ message: "Véhicule non trouvé" })
        }
        return res.status(200).json({message: "Voiture supprimée"})
    } catch (error) {
        /* handled by global error handler or ignored */
        return res.status(500).json({ message: "Erreur lors de la suppression" })
    }
}

module.exports = {
    createVoiture,
    getAllVoitures,
    getVoitureById,
    updateVoiture,
    deleteVoiture
}