// src/controllers/demandeController.js
const pool = require('../config/db.js');

// [POST] : Soumettre une demande depuis le terrain
// Structure req.body : { "titre_demande": "Besoin de ciment", "description": "50 sacs", "id_projet": 2, "id_employe": 1 }
// Note : req.user.id vient du middleware JWT (l'utilisateur connecté)
const createDemande = async (req, res) => {
    const { titre_demande, description, id_projet, id_employe } = req.body;
    const id_utilisateur = req.user.id; 
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

// [GET] : Voir toutes les demandes avec détails (Qui demande, et sur quel chantier ?)
// Structure URL : GET /api/demandes
const getAllDemandes = async (req, res) => {
    try {
        const query = `
            SELECT d.*, p.nom_projet, e.nom as nom_employe, u.email as email_demandeur
            FROM demandes d
            JOIN projets p ON d.id_projet = p.id_projet
            JOIN employes e ON d.id_employe = e.id_employe
            JOIN utilisateur u ON d.id_utilisateur = u.id
            ORDER BY d.create_at DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [PATCH] : Approuver ou Refuser une demande (Action des bureaux administratifs)
// Structure req.params : id (id_demande dans l'URL)
// Structure req.body : { "statut": "Approuve" } (En_attente, Approuve, Refuse)
const traiterDemande = async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;
    try {
        const query = 'UPDATE demandes SET statut = $1 WHERE id_demande = $2 RETURNING *';
        const result = await pool.query(query, [statut, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Demande introuvable" });
        res.json({ message: `Demande passée au statut : ${statut}`, demande: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [DELETE] : Annuler une demande
// Structure req.params : id
const deleteDemande = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM demandes WHERE id_demande = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Demande introuvable" });
        res.json({ message: "Demande annulée avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createDemande,
    getAllDemandes,
    traiterDemande,
    deleteDemande
};