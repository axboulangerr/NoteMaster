import express from 'express';
import { fileService } from '../fileService';
import { AuthenticatedRequest } from '../middleware';
import { ApiResponse, MarkdownFile } from '../types';

const router = express.Router();

// Créer un nouveau fichier
router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || content === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Titre et contenu requis'
      } as ApiResponse);
    }

    const fileData = {
      user_id: req.user!.id,
      title,
      content
    };

    const newFile = await fileService.createFile(fileData);
    
    res.status(201).json({
      success: true,
      data: newFile,
      message: 'Fichier créé avec succès'
    } as ApiResponse);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la création du fichier'
    } as ApiResponse);
  }
});

// Récupérer tous les fichiers de l'utilisateur
router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { search } = req.query;
    
    let files: MarkdownFile[];
    
    if (search && typeof search === 'string') {
      files = await fileService.searchFiles(req.user!.id, search);
    } else {
      files = await fileService.getFilesByUserId(req.user!.id);
    }
    
    res.json({
      success: true,
      data: files
    } as ApiResponse);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la récupération des fichiers'
    } as ApiResponse);
  }
});

// Récupérer un fichier spécifique
router.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const fileId = parseInt(req.params.id);
    
    if (isNaN(fileId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de fichier invalide'
      } as ApiResponse);
    }

    const file = await fileService.getFileById(fileId, req.user!.id);
    
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Fichier non trouvé'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: file
    } as ApiResponse);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la récupération du fichier'
    } as ApiResponse);
  }
});

// Mettre à jour un fichier
router.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const { title, content } = req.body;
    
    if (isNaN(fileId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de fichier invalide'
      } as ApiResponse);
    }

    const updates: Partial<Pick<MarkdownFile, 'title' | 'content'>> = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucune mise à jour fournie'
      } as ApiResponse);
    }

    const updatedFile = await fileService.updateFile(fileId, req.user!.id, updates);
    
    if (!updatedFile) {
      return res.status(404).json({
        success: false,
        error: 'Fichier non trouvé'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      data: updatedFile,
      message: 'Fichier mis à jour avec succès'
    } as ApiResponse);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du fichier'
    } as ApiResponse);
  }
});

// Supprimer un fichier
router.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const fileId = parseInt(req.params.id);
    
    if (isNaN(fileId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de fichier invalide'
      } as ApiResponse);
    }

    const deleted = await fileService.deleteFile(fileId, req.user!.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Fichier non trouvé'
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: 'Fichier supprimé avec succès'
    } as ApiResponse);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la suppression du fichier'
    } as ApiResponse);
  }
});

export default router;
