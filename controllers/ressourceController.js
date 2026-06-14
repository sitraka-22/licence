// src/controllers/ressourceController.js
const pool = require('../config/db')
// [POST] : Créer une nouvelle ressource
// Structure req.body : { "nom_ressource": "Excavatrice CAT 320", "categorie": "Engin", "quantite_disponible": 2 }
const createRessource = async (req, res) => {
    const { nom_ressource, categorie, quantite_disponible } = req.body;
    try {
        // Ajout explicite de is_delete à false pour éviter toute restriction de contrainte
        const query = `
            INSERT INTO ressources (nom_ressource, categorie, quantite_disponible, id_projet, is_delete) 
            VALUES ($1, $2, $3, NULL, false) 
            RETURNING *`;
            
        const result = await pool.query(query, [
            nom_ressource, 
            categorie, 
            parseInt(quantite_disponible, 10) || 1
        ]);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Erreur SQL lors du INSERT :", error.message);
        res.status(500).json({ error: error.message });
    }
};

// [GET] : Lister toutes les ressources avec le nom du projet associé (Jointure)
// Structure URL : GET /api/ressources
const getAllRessources = async (req, res) => {
    try {
        const query = `
            SELECT r.*, p.nom_projet 
            FROM ressources r
            LEFT JOIN projets p ON r.id_projet = p.id_projet
            WHERE r.is_delete = false
            ORDER BY r.id_ressource DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [PATCH] : Affecter une ressource à un projet (Chantier)
// Structure req.params : id_ressource (dans l'URL)
// Structure req.body : { "id_projet": 3 } (ou null pour désaffecter)
const affecterRessource = async (req, res) => {
    const { id } = req.params; // id_ressource
    const { id_projet } = req.body;
    try {
        const query = `
            UPDATE ressources 
            SET id_projet = $1 
            WHERE id_ressource = $2 RETURNING *`;
        const result = await pool.query(query, [id_projet, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Ressource introuvable" });
        res.json({ message: "Affectation mise à jour", ressource: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [DELETE] : Supprimer définitivement un matériel du stock
// Structure req.params : id (dans l'URL)
const deleteRessource = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `UPDATE ressources SET is_delete = true, delete_at = NOW() WHERE id_ressource = $1 RETURNING *`;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Ressource introuvable" });
        res.json({ message: "Ressource envoyée à la corbeille." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createRessource,
    getAllRessources,
    affecterRessource,
    deleteRessource

};