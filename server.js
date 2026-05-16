const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importation de nos modules et algorithmes séparés
const authController = require('./controllers/authController');
const verifyToken = require('./middleware/authMiddleware');

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// Routes Publiques (Accessibles sans token)
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);

// Route Protégée (Le middleware "verifyToken" bloque l'accès si pas de token valide)
app.get('/api/dashboard', verifyToken, (req, res) => {
    // Si on arrive ici, c'est que verifyToken a fait "next()"
    res.json({ 
        secretData: `Bienvenue ${req.user.email} ! Voici tes données sécurisées provenant du serveur.` 
    });
});

// Démarrage du serveur via le port du fichier .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré et segmenté sur le port ${PORT}`);
});