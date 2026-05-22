const express = require('express');
const router = express.Router();

const ressourceController = require('../controllers/ressourceController');

router.get('/ressources',  ressourceController.getAllRessources);
router.post('/ressources', ressourceController.affecterRessource);
router.delete('/ressources/:id', ressourceController.deleteRessource);
