const Voiture = require('./../../../models/voiture.model')

const createVoiture = async (req, res) => {
    try {
        const saveVoiture = await Voiture.create(req.body)
        return res.status(201).json(saveVoiture)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la création du véhicule" })
    }
}

const getAllVoitures = async (req, res) => {
    try {
        const voitures = await Voiture.find()
        return res.status(200).json(voitures)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Impossible de récupérer les véhicules" })
    }
}

const getVoitureById = async (req, res) => {
    try {
        const voitureId = req.params.id
        const voiture = await Voiture.findById(voitureId)
        if (!voiture) {
            return res.status(404).json({ message: "Véhicule non trouvé" })
        }
        return res.status(200).json(voiture)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la récupération du véhicule" })
    }
}

const updateVoiture = async (req, res) => {
    try {
        const voitureId = req.params.id
        const update = await Voiture.findByIdAndUpdate(voitureId, req.body, {new: true})
        if (!update) {
            return res.status(404).json({ message: "Véhicule non trouvé" })
        }
        return res.status(200).json(update)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur lors de la mise à jour" })
    }
}

const deleteVoiture = async (req, res) => {
    try {
        const voitureId = req.params.id
        const deleted = await Voiture.findByIdAndDelete(voitureId)
        if (!deleted) {
            return res.status(404).json({ message: "Véhicule non trouvé" })
        }
        return res.status(200).json({message: "Voiture supprimée"})
    } catch (error) {
        console.error(error);
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