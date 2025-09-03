import { Request, Response, NextFunction } from 'express';
import { authService } from './auth';
import { ApiResponse } from './types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Token d\'accès requis' 
      } as ApiResponse);
      return;
    }

    const decoded = authService.verifyToken(token);
    const user = await authService.findUserById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ 
        success: false, 
        error: 'Utilisateur non trouvé' 
      } as ApiResponse);
      return;
    }

    req.user = {
      id: user.id!,
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    res.status(403).json({ 
      success: false, 
      error: 'Token invalide' 
    } as ApiResponse);
  }
};
