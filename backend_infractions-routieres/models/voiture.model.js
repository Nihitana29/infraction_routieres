const mongoose = require('mongoose')

const voitureSchema = new mongoose.Schema({
    plaque: { 
        type: String, 
        unique: true, 
        required: true,
        match: [/^[0-9]{4}\s[A-Z]{2,3}$/, 'Veuillez fournir un numéro de plaque valide (ex: 1234 TAA)']
    },
    proprietaire: { type: String, required: true },
    marque: { type: String, required: true },
    modele: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model("Voiture", voitureSchema)