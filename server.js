const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); 
const projetRoutes = require('./routes/projetRoutes');

// 2. Importation du middleware pour le dashboard
// Vérifie bien s'il y a un 's' ou non à ton dossier (middleware VS middlewares)
const verifyToken = require('./middleware/authMiddleware'); 

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// --- BRANCHEMENT DES ROUTES MODULAIRES ---
// Toutes les routes d'authentification seront préfixées par /api/auth
app.use('/api/auth', authRoutes);

// Toutes les routes des projets seront préfixées par /api/projets
app.use('/api/projets', projetRoutes);


// --- ROUTE PROTÉGÉE DIRECTE ---
app.get('/api/dashboard', verifyToken, (req, res) => {
    res.json({ 
        secretData: `Bienvenue ${req.user.email} ! Voici tes données sécurisées provenant du serveur.` 
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré et segmenté sur le port ${PORT}`);
});