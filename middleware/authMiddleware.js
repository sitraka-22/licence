const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide ou expiré." });
        }
        
        // On stocke les infos de l'utilisateur décodées dans la requête pour les routes suivantes
        req.user = decoded; 
        next(); // On passe à l'algorithme suivant (le contrôleur)
    });
};

module.exports = verifyToken;