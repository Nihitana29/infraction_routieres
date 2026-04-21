const Voiture = require('./../../../models/voiture.model')

const createVoiture = async (req, res, next) => {
    try {
        const { plaque, marque, modele, proprietaire } = req.body;
        const saveVoiture = await Voiture.create({ plaque, marque, modele, proprietaire })
        return res.status(201).json(saveVoiture)
    } catch (error) {
        next(error)
    }
}

const getAllVoitures = async (req, res, next) => {
    try {
        const voitures = await Voiture.find()
        return res.status(200).json(voitures)
    } catch (error) {
        next(error)
    }
}

const getVoitureById = async (req, res, next) => {
    try {
        const voitureId = req.params.id
        const voiture = await Voiture.findById(voitureId)
        if (!voiture) {
            return res.status(404).json({ message: "Véhicule non trouvé" })
        }
        return res.status(200).json(voiture)
    } catch (error) {
        next(error)
    }
}

const updateVoiture = async (req, res, next) => {
    try {
        const voitureId = req.params.id
        const { plaque, marque, modele, proprietaire } = req.body;
        const update = await Voiture.findByIdAndUpdate(voitureId, { plaque, marque, modele, proprietaire }, {new: true})
        if (!update) {
            return res.status(404).json({ message: "Véhicule non trouvé" })
        }
        return res.status(200).json(update)
    } catch (error) {
        next(error)
    }
}

const deleteVoiture = async (req, res, next) => {
    try {
        const voitureId = req.params.id
        const deleted = await Voiture.findByIdAndDelete(voitureId)
        if (!deleted) {
            return res.status(404).json({ message: "Véhicule non trouvé" })
        }
        return res.status(200).json({message: "Voiture supprimée"})
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createVoiture,
    getAllVoitures,
    getVoitureById,
    updateVoiture,
    deleteVoiture
}