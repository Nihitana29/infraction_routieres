const Voiture = require('./../../../models/voiture.model')

const createVoiture = async (req, res) => {
    try {
        const saveVoiture = await Voiture.create(req.body)
        return res.status(201).json(saveVoiture)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getAllVoitures = async (req, res) => {
    try {
        const voitures = await Voiture.find()
        return res.status(200).json(voitures)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getVoitureById = async (req, res) => {
    try {
        const voitureId = req.params.id
        const voiture = await Voiture.findById(voitureId)
        return res.status(200).json(voiture)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const updateVoiture = async (req, res) => {
    try {
        const voitureId = req.params.id
        const update = await Voiture.findByIdAndUpdate(voitureId, req.body, {new: true})
        return res.status(201).json(update)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteVoiture = async (req, res) => {
    try {
        const voitureId = req.params.id
        await Voiture.findByIdAndDelete(voitureId)
        return res.status(200).json({message: "Voiture supprimée"})
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

module.exports = {
    createVoiture,
    getAllVoitures,
    getVoitureById,
    updateVoiture,
    deleteVoiture
}