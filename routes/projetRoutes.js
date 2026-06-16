const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');
const verifyToken = require('../middleware/authMiddleware'); // Ton middleware de vérification

// Toutes les routes ci-dessous sont protégées par le Token JWT
router.post('/', verifyToken, projetController.creerProjet);
router.get('/', verifyToken, projetController.obtenirTousLesProjets);
router.delete('/:id', verifyToken, projetController.softDeleteProjet);
router.patch('/:id/restaurer', verifyToken, projetController.restaurerProjet);

module.exports = router;