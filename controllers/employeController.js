// src/controllers/employeController.js
const pool = require('../config/db.js');

// [POST] : Embaucher / Enregistrer un nouvel employé
// Structure req.body : { "nom": "Ranaivo", "prenom": "Jean", "telephone": "0340000000", "poste": "Chef_Chantier", "salaire_journalier": 75000, "id_projet": 1, "id_utilisateur": null }
const createEmploye = async (req, res) => {
    const { nom, prenom, telephone, poste, salaire_journalier, id_projet, id_utilisateur } = req.body;
    try {
        const query = `
            INSERT INTO employes (nom, prenom, telephone, poste, salaire_journalier, id_projet, id_utilisateur) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const result = await pool.query(query, [nom, prenom, telephone, poste, salaire_journalier, id_projet, id_utilisateur]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [GET] : Obtenir la liste complète des employés avec leur chantier actuel
const getAllEmployes = async (req, res) => {
    try {
        const { poste, id_projet } = req.query;
        let query = `
            SELECT e.*, p.nom_projet 
            FROM employes e
            LEFT JOIN projets p ON e.id_projet = p.id_projet
            WHERE 1=1
        `;
        const params = [];

        // Filtre par poste si présent
        if (poste) {
            params.push(poste);
            query += ` AND e.poste = $${params.length}`;
        }

        // Filtre par projet si présent
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

// [PATCH] : Transférer un employé vers un autre chantier (Changement d'équipe)
// Structure req.params : id (id_employe)
// Structure req.body : { "id_projet": 3 }
const changerChantierEmploye = async (req, res) => {
    const { id } = req.params;
    const { id_projet } = req.body;
    try {
        const query = 'UPDATE employes SET id_projet = $1 WHERE id_employe = $2 RETURNING *';
        const result = await pool.query(query, [id_projet, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Employé introuvable" });
        res.json({ message: "Mutation effectuée avec succès.", employe: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [DELETE] : Retirer un employé des effectifs (Licenciement / Fin de contrat)
const deleteEmploye = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM employes WHERE id_employe = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Employé introuvable" });
        res.json({ message: "Employé retiré de la base de données de l'entreprise COLASS." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createEmploye,
    getAllEmployes,
    changerChantierEmploye,
    deleteEmploye
};