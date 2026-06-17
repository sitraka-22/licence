const pool = require('../config/db.js');

// [POST] Créer une demande
const createDemande = async (req, res) => {
    const { titre_demande, description, id_projet, id_employe } = req.body;
    const id_utilisateur = req.user.userId;
    try {
        const query = `
            INSERT INTO demandes (titre_demande, description, id_projet, id_utilisateur, id_employe) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await pool.query(query, [titre_demande, description, id_projet, id_utilisateur, id_employe]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [GET] Toutes les demandes actives (is_delete = false)
const getAllDemandes = async (req, res) => {
    try {
        const query = `
            SELECT d.*, p.nom_projet, e.nom as nom_employe, u.email as email_demandeur
            FROM demandes d
            JOIN projets p ON d.id_projet = p.id_projet
            LEFT JOIN employes e ON d.id_employe = e.id_employe
            JOIN utilisateur u ON d.id_utilisateur = u.id
            WHERE d.is_delete = false
            ORDER BY d.create_at DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [GET] Corbeille (is_delete = true)
const getCorbeille = async (req, res) => {
    try {
        const query = `
            SELECT d.*, p.nom_projet, e.nom as nom_employe, u.email as email_demandeur
            FROM demandes d
            JOIN projets p ON d.id_projet = p.id_projet
            LEFT JOIN employes e ON d.id_employe = e.id_employe
            JOIN utilisateur u ON d.id_utilisateur = u.id
            WHERE d.is_delete = true
            ORDER BY d.delete_at DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [PATCH] Approuver ou Refuser une demande
const traiterDemande = async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;
    try {
        const query = 'UPDATE demandes SET staut = $1 WHERE id_demande = $2 RETURNING *';
        const result = await pool.query(query, [statut, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Demande introuvable" });
        res.json({ message: `Demande passée au statut : ${statut}`, demande: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [DELETE] Soft delete → corbeille
const softDeleteDemande = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            UPDATE demandes 
            SET is_delete = true, delete_at = CURRENT_TIMESTAMP 
            WHERE id_demande = $1 AND is_delete = false
            RETURNING *`;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Demande introuvable." });
        res.json({ message: "Demande déplacée dans la corbeille." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [PATCH] Restaurer depuis la corbeille
const restaurerDemande = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            UPDATE demandes 
            SET is_delete = false, delete_at = NULL 
            WHERE id_demande = $1 AND is_delete = true
            RETURNING *`;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Demande introuvable dans la corbeille." });
        res.json({ message: "Demande restaurée avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [DELETE] Suppression définitive
const supprimerDefinitivement = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            DELETE FROM demandes 
            WHERE id_demande = $1 AND is_delete = true
            RETURNING *`;
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Demande introuvable dans la corbeille." });
        res.json({ message: "Demande supprimée définitivement." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createDemande,
    getAllDemandes,
    getCorbeille,
    traiterDemande,
    softDeleteDemande,
    restaurerDemande,
    supprimerDefinitivement
};