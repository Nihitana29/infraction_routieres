const Infraction = require('./../../../models/infraction.model')
const Voiture = require('./../../../models/voiture.model')

const createInfraction = async (req, res, next) => {
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
        next(error)
    }
}

const getAllInfractions = async (req, res, next) => {
    try {
        const infractions = await Infraction.find().populate('voiture')
        return res.status(200).json(infractions)
    } catch (error) {
        next(error)
    }
}

const getInfractionById = async (req, res, next) => {
    try {
        const infractionId = req.params.id
        const infraction = await Infraction.findById(infractionId).populate('voiture')
        if (!infraction) {
            return res.status(404).json({ message: "Infraction non trouvée" })
        }
        return res.status(200).json(infraction)
    } catch (error) {
        next(error)
    }
}

const getInfractionsByVoiture = async (req, res, next) => {
    try {
        const voitureId = req.params.id
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
        next(error)
    }
}

const updateInfraction = async (req, res, next) => {
    try {
        const { plaque, type, montant, statut } = req.body;
        const voiture = await Voiture.findOne({ plaque })
        if(!voiture) {
            return res.status(404).json({ message: "Voiture non trouvée" })
        }
        const infractionId = req.params.id 
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
        next(error)
    }
}

const deleteInfraction = async (req, res, next) => {
    try {
        const infractionId = req.params.id
        const deleted = await Infraction.findByIdAndDelete(infractionId)
        if (!deleted) {
            return res.status(404).json({ message: "Infraction non trouvée" })
        }
        return res.status(200).json({message: "Infraction supprimée"})
    } catch (error) {
        next(error)
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