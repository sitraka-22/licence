const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

// Algorithme d'Inscription
const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Vérifier si l'utilisateur existe déjà
        const userExists = await pool.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // 2. Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insérer en base de données
        const newUser = await pool.query(
            'INSERT INTO utilisateur (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        res.status(201).json({ 
            message: "Utilisateur créé avec succès !", 
            user: newUser.rows[0] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
};

// Algorithme de Connexion
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Chercher l'utilisateur
        const result = await pool.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ message: "Identifiants incorrects." });
        }

        // 2. Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Identifiants incorrects." });
        }

        // 3. Générer le Token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token, message: "Connexion réussie !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la connexion." });
    }
};

module.exports = {
    register,
    login
};