const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const ressourceController = require('../controllers/ressourceController');

router.get('/',verifyToken,  ressourceController.getAllRessources);
router.post('/',verifyToken, ressourceController.createRessource);
router.patch('/:id',verifyToken, ressourceController.affecterRessource);
router.delete('/:id',verifyToken, ressourceController.deleteRessource);
module.exports = router;
