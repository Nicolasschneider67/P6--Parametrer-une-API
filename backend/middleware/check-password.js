//Sert à augmenter la sécurité sur les MDP
const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'Le MDP doit faire 8 caractère au moins, comprenant au moins une majuscule et un chiffre.' });
    } else {
        next();
    }
};