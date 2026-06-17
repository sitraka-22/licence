const express = require("express");
const router = express.Router();
const demandeController = require("../controllers/demandeController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, demandeController.createDemande);
router.get("/", verifyToken, demandeController.getAllDemandes);
router.get("/corbeille", verifyToken, demandeController.getCorbeille);

// Modification de la demande
router.put("/:id", verifyToken, demandeController.updateDemande);

// Traitement des statuts (Approuve / Refuse)
router.patch("/:id", verifyToken, demandeController.traiterDemande);

// Gestion de la corbeille
router.delete("/:id", verifyToken, demandeController.softDeleteDemande);
router.patch("/:id/restaurer", verifyToken, demandeController.restaurerDemande);
router.delete(
  "/:id/definitif",
  verifyToken,
  demandeController.supprimerDefinitivement,
);

module.exports = router;
