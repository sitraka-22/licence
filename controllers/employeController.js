const pool = require("../config/db.js");

// [POST] : Embaucher / Enregistrer un nouvel employé
const createEmploye = async (req, res) => {
  const {
    nom,
    prenom,
    telephone,
    poste,
    salaire_journalier,
    id_projet,
    id_utilisateur,
  } = req.body;
  try {
    const query = `
            INSERT INTO employes (nom, prenom, telephone, poste, salaire_journalier, id_projet, id_utilisateur, is_delete) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, false) RETURNING *`;
    const result = await pool.query(query, [
      nom,
      prenom,
      telephone,
      poste,
      salaire_journalier,
      id_projet,
      id_utilisateur,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [GET] : Obtenir la liste complète des employés
const getAllEmployes = async (req, res) => {
  try {
    const { poste, id_projet } = req.query;
    // On récupère tout le monde (actifs et corbeille), le filtrage fin se fera côté client
    let query = `
            SELECT e.*, p.nom_projet 
            FROM employes e
            LEFT JOIN projets p ON e.id_projet = p.id_projet
            WHERE 1=1
        `;
    const params = [];

    if (poste) {
      params.push(poste);
      query += ` AND e.poste = $${params.length}`;
    }

    if (id_projet) {
      params.push(id_projet);
      query += ` AND e.id_projet = $${params.length}`;
    }

    query += ` ORDER BY e.id_employe DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [PATCH] : Transférer un employé vers un autre chantier
const changerChantierEmploye = async (req, res) => {
  const { id } = req.params;
  const { id_projet } = req.body;
  try {
    const query =
      "UPDATE employes SET id_projet = $1 WHERE id_employe = $2 RETURNING *";
    const result = await pool.query(query, [id_projet, id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Employé introuvable" });
    res.json({
      message: "Mutation effectuée avec succès.",
      employe: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [DELETE] : Envoyer à la corbeille (Soft Delete)
const deleteEmploye = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `UPDATE employes SET is_delete = true, delete_at = CURRENT_TIMESTAMP WHERE id_employe = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Employé introuvable" });
    res.json({ message: "Employé déplacé dans la corbeille avec succès." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [PATCH] : Restaurer un employé depuis la corbeille
const restoreEmploye = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `UPDATE employes SET is_delete = false WHERE id_employe = $1 RETURNING *`;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Employé introuvable" });
    res.json({
      message: "Employé restauré avec succès.",
      employe: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// [DELETE] : Suppression définitive (Hard Delete)
const hardDeleteEmploye = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM employes WHERE id_employe = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Employé introuvable" });
    res.json({
      message:
        "Employé définitivement retiré des effectifs de l'entreprise COLASS.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEmploye,
  getAllEmployes,
  changerChantierEmploye,
  deleteEmploye,
  restoreEmploye,
  hardDeleteEmploye,
};
