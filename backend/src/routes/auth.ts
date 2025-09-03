import express from 'express';
import { authService } from '../auth';
import { ApiResponse, AuthRequest, RegisterRequest } from '../types';

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const userData: RegisterRequest = req.body;
    
    // Validation basique
    if (!userData.username || !userData.email || !userData.password) {
      return res.status(400).json({
        success: false,
        error: 'Nom d\'utilisateur, email et mot de passe requis'
      } as ApiResponse);
    }

    if (userData.password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Le mot de passe doit contenir au moins 6 caractères'
      } as ApiResponse);
    }

    const result = await authService.register(userData);
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'Utilisateur créé avec succès'
    } as ApiResponse);
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription'
    } as ApiResponse);
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const credentials: AuthRequest = req.body;
    
    if (!credentials.username || !credentials.password) {
      return res.status(400).json({
        success: false,
        error: 'Nom d\'utilisateur et mot de passe requis'
      } as ApiResponse);
    }

    const result = await authService.login(credentials);
    
    res.json({
      success: true,
      data: result,
      message: 'Connexion réussie'
    } as ApiResponse);
    
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la connexion'
    } as ApiResponse);
  }
});

export default router;
