const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const projetRoutes = require("./routes/projetRoutes");
const employeRouter = require("./routes/employeRoutes");
const demandeRoutes = require('./routes/demandeRoutes');
const ressourceRoutes = require("./routes/ressourceRoutes");
const verifyToken = require("./middleware/authMiddleware");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// Toutes les routes d'authentification seront préfixées par /api/auth
app.use("/api/auth", authRoutes);

// Toutes les routes des projets seront préfixées par /api/projets
app.use("/api/projets", projetRoutes);

app.use('/api/employes', employeRouter);

app.use('/api/ressources', ressourceRoutes);

app.use('/api/demandes', demandeRoutes);

// --- ROUTE PROTÉGÉE DIRECTE ---
app.get("/api/dashboard", verifyToken, (req, res) => {
  res.json({
    secretData: `Bienvenue ${req.user.email} ! Voici tes données sécurisées provenant du serveur.`,
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré et segmenté sur le port ${PORT}`);
});
