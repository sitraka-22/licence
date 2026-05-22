// src/controllers/paiementController.js
import pool from '../config/db.js';

// [POST] : Enregistrer une nouvelle dépense sur un chantier
// Structure req.body : { "montant": 450000.00, "description": "Achat bitume route RN7", "id_projet": 2 }
export const createPaiement = async (req, res) => {
    const { montant, description, id_projet } = req.body;
    try {
        const query = `
            INSERT INTO paiements (montant, description, id_projet) 
            VALUES ($1, $2, $3) RETURNING *`;
        const result = await pool.query(query, [montant, description, id_projet]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [GET] : Récupérer l'historique financier global avec le nom du projet ciblé
// Structure URL : GET /api/paiements
export const getAllPaiements = async (req, res) => {
    try {
        const query = `
            SELECT pay.*, p.nom_projet, p.budget as budget_total_projet
            FROM paiements pay
            JOIN projets p ON pay.id_projet = p.id_projet
            ORDER BY pay.date_paiement DESC`;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [PUT] : Corriger un montant ou une description de paiement erronée
// Structure req.params : id (id_paiement)
// Structure req.body : { "montant": 400000.00, "description": "Achat bitume (correction prix)" }
export const updatePaiement = async (req, res) => {
    const { id } = req.params;
    const { montant, description } = req.body;
    try {
        const query = `
            UPDATE paiements 
            SET montant = $1, description = $2 
            WHERE id_paiement = $3 RETURNING *`;
        const result = await pool.query(query, [montant, description, id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Transaction introuvable" });
        res.json({ message: "Paiement mis à jour", transaction: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [DELETE] : Supprimer une transaction financière
export const deletePaiement = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM paiements WHERE id_paiement = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ message: "Transaction introuvable" });
        res.json({ message: "Enregistrement comptable supprimé." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};