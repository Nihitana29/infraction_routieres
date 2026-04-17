const mongoose = require('mongoose')

const infractionSchema = new mongoose.Schema({
    voiture: { type: mongoose.Schema.ObjectId, ref: "Voiture", required: true },
    type: { type: String, required: true },
    montant: { type: Number, required: true },
    statut: { type: String, enum: ['impaye', 'paye'], default: 'impaye', required: true }
}, { timestamps: true })

module.exports = mongoose.model("Infraction", infractionSchema)