const Infraction = require('./../../../models/infraction.model')
const Voiture = require('./../../../models/voiture.model')

const createInfraction = async (req, res) => {
    try {
        const voiture = await Voiture.findOne({ plaque: req.body.plaque })
        if(!voiture) {
            return res.status(404).json({ message: "Voiture non trouvée" })
        }
        const saveInfraction = await Infraction.create({
            voiture: voiture._id,
            type: req.body.type,
            montant: req.body.montant,
            statut: req.body.statut
        })
        return res.status(201).json(saveInfraction)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getAllInfractions = async (req, res) => {
    try {
        const infractions = await Infraction.find().populate('voiture')
        return res.status(200).json(infractions)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getInfractionById = async (req, res) => {
    try {
        const infractionId = req.params.id
        const infraction = await Infraction.findById(infractionId).populate('voiture')
        return res.status(200).json(infraction)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getInfractionsByVoiture = async (req, res) => {
    try {
        const voitureId = req.params.id
        const voiture = await Voiture.findById(voitureId)
        const infractions = await Infraction.find({ voiture: voitureId }).populate('voiture')
        return res.status(200).json({
            voiture, 
            infractions
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const updateInfraction = async (req, res) => {
    try {
        const voiture = await Voiture.findOne({ plaque: req.body.plaque })
        if(!voiture) {
            return res.status(404).json({ message: "Voiture non trouvée" })
        }
        const infractionId = req.params.id 
        const update = await Infraction.findByIdAndUpdate(infractionId, {
            voiture: voiture._id,
            type: req.body.type,
            montant: req.body.montant,
            statut: req.body.statut
        }, {new: true})
        return res.status(201).json(update)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteInfraction = async (req, res) => {
    try {
        const infractionId = req.params.id
        await Infraction.findByIdAndDelete(infractionId)
        return res.status(200).json({message: "Infraction supprimée"})
    } catch (error) {
        return res.status(500).json({error: error.message})
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