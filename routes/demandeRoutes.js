const express = require('express');
const router = express.Router();
const demandeController = require('../controllers/demandeController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken, demandeController.createDemande);
router.get('/', verifyToken, demandeController.getAllDemandes);
router.get('/corbeille', verifyToken, demandeController.getCorbeille);
router.patch('/:id', verifyToken, demandeController.traiterDemande);
router.delete('/:id', verifyToken, demandeController.softDeleteDemande);
router.patch('/:id/restaurer', verifyToken, demandeController.restaurerDemande);
router.delete('/:id/definitif', verifyToken, demandeController.supprimerDefinitivement);

module.exports = router;
//damn 