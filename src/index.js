
import express from 'express';
import dotenv from 'dotenv';
import emailRoutes from './routes/email.routes.js';

// Charger les variables d'environnement depuis .env
dotenv.config();

const app = express();

// Middleware pour parser le JSON des requêtes
app.use(express.json());

// Routes Email
app.use('/email', emailRoutes);

// Middleware pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware pour gérer les erreurs serveur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
