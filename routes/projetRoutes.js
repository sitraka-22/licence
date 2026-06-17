const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, projetController.creerProjet);
router.get('/', verifyToken, projetController.obtenirTousLesProjets);
router.delete('/:id', verifyToken, projetController.softDeleteProjet);
router.patch('/:id/restaurer', verifyToken, projetController.restaurerProjet);
router.delete('/:id/definitif', verifyToken, projetController.supprimerDefinitivement); // ← nouveau
router.put('/:id', verifyToken, projetController.modifierProjet);

module.exports = router;