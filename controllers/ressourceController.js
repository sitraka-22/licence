// src/controllers/ressourceController.js
const poll = require('../config/db')
// [POST] : Créer une nouvelle ressource
// Structure req.body : { "nom_ressource": "Excavatrice CAT 320", "categorie": "Engin", "quantite_disponible": 2 }
export const createRessource = async (req, res) => {
    const { nom_ressource, categorie, quantite_disponible } = req.body;
    try {
        const query = `
            INSERT INTO ressources (nom_ressource, categorie, quantite_disponible) 
            VALUES ($1, $2, $3) RETURNING *`;
        const result = await pool.query(query, [nom_ressource, categorie, quantite_disponible || 1]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [GET] : Lister toutes les ressources avec le nom du projet associé (Jointure)
// Structure URL : GET /api/ressources
export const getAllRessources = async (req, res) => {
    try {
        const query = `
            SELECT r.*, p.nom_projet 
            FROM ressources r
            LEFT JOIN projets p ON r.id_projet = p.id_projet
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
export const affecterRessource = async (req, res) => {
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
export const deleteRessource = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM ressources WHERE id_ressource = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Ressource introuvable" });
        res.json({ message: "Ressource supprimée du parc informatique/matériel." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};