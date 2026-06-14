const express = require('express');
const { 
    createEmploye, 
    getAllEmployes, 
    changerChantierEmploye, 
    deleteEmploye 
} = require('../controllers/employeController.js');

const router = express.Router();

// [POST] : Enregistrer un nouvel employé
router.post('/', createEmploye);

// [GET] : Obtenir la liste filtrée ou complète des employés
router.get('/', getAllEmployes);

// [PATCH] : Transférer un employé vers un autre chantier
router.patch('/:id/chantier', changerChantierEmploye);

// [DELETE] : Licencier / Supprimer un employé
router.delete('/:id', deleteEmploye);

module.exports = router;