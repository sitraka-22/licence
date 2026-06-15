const { Pool } = require('pg');
require('dotenv').config(); // Charge les variables du fichier .env

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Petit test de connexion pour être sûr que tout fonctionne
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erreur de connexion à PostgreSQL :', err.stack);
    }
    console.log('Connecté avec succès à la base de données PostgreSQL ianao !');
    release();
});
//bomboclate 
//lobs
module.exports = pool;