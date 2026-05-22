const express = require('express');
const router = express.Router();

const demandeController = require('../controllers/demandeController');

router.post('/demande/register', demandeController.createDemande);
router.get('/demande', demandeController.getAllDemandes);
router.get('demande/:id', demandeController.traiterDemande);
module.exports = router;