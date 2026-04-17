const mongoose = require('mongoose')

const voitureSchema = new mongoose.Schema({
    plaque: { type: String, unique: true, required: true },
    proprietaire: { type: String, required: true },
    marque: { type: String, required: true },
    modele: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("Voiture", voitureSchema)