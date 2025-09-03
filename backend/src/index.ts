import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authenticateToken } from './middleware';
import authRoutes from './routes/auth';
import fileRoutes from './routes/files';
import convertRoutes from './routes/convert';

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de sécurité et utilitaires
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées (nécessitent une authentification)
app.use('/api/files', authenticateToken, fileRoutes);
app.use('/api/convert', authenticateToken, convertRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NoteMaster API is running',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trouvé'
  });
});

// Gestion globale des erreurs
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur serveur:', err);
  
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur NoteMaster démarré sur le port ${PORT}`);
  console.log(`📋 API disponible sur: http://localhost:${PORT}/api`);
  console.log(`🏥 Santé du serveur: http://localhost:${PORT}/api/health`);
});

export default app;
