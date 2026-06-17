const express = require("express");
const {
  createEmploye,
  getAllEmployes,
  changerChantierEmploye,
  deleteEmploye,
  restoreEmploye,
  hardDeleteEmploye,
} = require("../controllers/employeController.js");

// Importation du middleware de vérification du JWT
// Note : Ajustez le chemin '../middlewares/auth.js' selon l'emplacement exact de votre fichier
const verifToken = require("../middleware/authMiddleware.js");

const router = express.Router();

// Optionnel : Si TOUTES les routes de ce fichier nécessitent une authentification,
// vous pouvez décommenter la ligne suivante pour éviter de l'écrire sur chaque route :
// router.use(verifToken);

// [POST] : Enregistrer un nouvel employé (Sécurisé)
router.post("/", verifToken, createEmploye);

// [GET] : Obtenir la liste filtrée ou complète des employés (Sécurisé)
router.get("/", verifToken, getAllEmployes);

// [PATCH] : Transférer un employé vers un autre chantier (Sécurisé)
router.patch("/:id/chantier", verifToken, changerChantierEmploye);

// [PATCH] : Restaurer un employé depuis la corbeille (Sécurisé)
router.patch("/:id/restore", verifToken, restoreEmploye);

// [DELETE] : Mettre à la corbeille - Soft Delete (Sécurisé)
router.delete("/:id", verifToken, deleteEmploye);

// [DELETE] : Supprimer définitivement - Hard Delete (Sécurisé)
router.delete("/:id/permanent", verifToken, hardDeleteEmploye);

module.exports = router;
