const express = require('express');
const router = express.Router();

const demandeController = require('../controllers/demandeController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/', verifyToken,demandeController.createDemande);
router.patch('/:id',verifyToken, demandeController.deleteDemande);
router.get('/', verifyToken,demandeController.getAllDemandes);
router.get('/:id', verifyToken,demandeController.traiterDemande);
module.exports = router;