
const pool = require('../config/db');

// 1. CRÉER UN PROJET (Pont, Bâtiment, Route)
const creerProjet = async (req, res) => {
    const { nom_projet, description, type, date_debut, date_fin_prevue, budget } = req.body;

    // Validation de sécurité basique
    if (!nom_projet || !type) {
        return res.status(400).json({ message: "Le nom du projet et le type sont obligatoires." });
    }

    try {
        const query = `
            INSERT INTO projets (nom_projet, description, type, date_debut, date_fin_prevue, budget)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const valeurs = [nom_projet, description, type, date_debut, date_fin_prevue, budget];
        const { rows } = await pool.query(query, valeurs);

        res.status(201).json({
            message: "Projet de construction créé avec succès !",
            projet: rows[0]
        });
    } catch (error) {
        console.error("Erreur creerProjet:", error);
        res.status(500).json({ message: "Erreur lors de la création du projet.", error: error.message });
    }
};

// 2. LIRE TOUS LES PROJECTIONS ACTIFS (Ceux qui ne sont pas dans la corbeille)
const obtenirTousLesProjets = async (req, res) => {
    try {
        // On ne prend que les projets où is_deleted = false
        const query = `SELECT * FROM projets WHERE is_deleted = false ORDER BY id_projet DESC;`;
        const { rows } = await pool.query(query);

        res.status(200).json(rows);
    } catch (error) {
        console.error("Erreur obtenirTousLesProjets:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des projets." });
    }
}

// 3. ENVOYER UN PROJET À LA CORBEILLE (Soft Delete)
const softDeleteProjet = async (req, res) => {
    const { id } = req.params; // Récupère l'id_projet depuis l'URL

    try {
        const query = `
            UPDATE projets 
            SET is_deleted = true, deleted_at = CURRENT_TIMESTAMP 
            WHERE id_projet = $1 AND is_deleted = false
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Projet introuvable ou déjà supprimé." });
        }

        res.status(200).json({
            message: "Projet déplacé dans la corbeille avec succès.",
            projet: rows[0]
        });
    } catch (error) {
        console.error("Erreur softDeleteProjet:", error);
        res.status(500).json({ message: "Erreur lors de la suppression temporaire." });
    }
};

// 4. RESTAURER UN PROJET DE LA CORBEILLE (Récupération)
const restaurerProjet = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            UPDATE projets 
            SET is_deleted = false, deleted_at = NULL 
            WHERE id_projet = $1 AND is_deleted = true
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Projet introuvable dans la corbeille." });
        }

        res.status(200).json({
            message: "Projet restauré avec succès !",
            projet: rows[0]
        });
    } catch (error) {
        console.error("Erreur restaurerProjet:", error);
        res.status(500).json({ message: "Erreur lors de la restauration du projet." });
    }
};

module.exports = {
    creerProjet,
    obtenirTousLesProjets,
    softDeleteProjet,
    restaurerProjet
};