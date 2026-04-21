const { body, param, validationResult } = require('express-validator');

/**
 * Middleware pour vérifier les résultats de la validation
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({ 
      message: "Erreur de validation des données",
      errors: errors.array() 
  });
};

/**
 * Validation des IDs dans les paramètres URL
 */
const paramIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Format d\'identifiant invalide')
];

/**
 * Règles de validation pour les Véhicules
 */
const voitureValidation = [
  body('plaque')
    .matches(/^[0-9]{4}\s[A-Z]{2,3}$/)
    .withMessage('La plaque doit être au format 1234 TAA ou 1234 TAAA'),
  body('proprietaire')
    .trim()
    .notEmpty()
    .withMessage('Le propriétaire est obligatoire')
    .escape(),
  body('marque')
    .trim()
    .notEmpty()
    .withMessage('La marque est obligatoire')
    .escape(),
  body('modele')
    .trim()
    .notEmpty()
    .withMessage('Le modèle est obligatoire')
    .escape()
];

/**
 * Règles de validation pour les Infractions
 */
const infractionValidation = [
  body('plaque')
    .matches(/^[0-9]{4}\s[A-Z]{2,3}$/)
    .withMessage('La plaque doit être au format 1234 TAA ou 1234 TAAA'),
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Le type d\'infraction est obligatoire')
    .escape(),
  body('montant')
    .isFloat({ min: 0 })
    .withMessage('Le montant doit être un nombre positif'),
  body('statut')
    .optional()
    .isIn(['impaye', 'paye'])
    .withMessage('Statut invalide')
];

module.exports = {
  validate,
  paramIdValidation,
  voitureValidation,
  infractionValidation
};
