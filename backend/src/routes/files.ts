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

// Ajouter une étiquette à un fichier
router.post('/:id/tags/:tagId', async (req: AuthenticatedRequest, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const tagId = parseInt(req.params.tagId);
    const userId = req.user!.id;
    
    if (isNaN(fileId) || isNaN(tagId)) {
      return res.status(400).json({
        success: false,
        error: 'IDs invalides'
      } as ApiResponse);
    }

    // Vérifier que le fichier appartient à l'utilisateur
    const file = await fileService.getFileById(fileId, userId);
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Fichier non trouvé'
      } as ApiResponse);
    }

    // Vérifier que l'étiquette appartient à l'utilisateur
    const { Database } = await import('../database');
    const tag = Database.prepare('SELECT id FROM tags WHERE id = ? AND user_id = ?').get(tagId, userId);
    if (!tag) {
      return res.status(404).json({
        success: false,
        error: 'Étiquette non trouvée'
      } as ApiResponse);
    }

    // Ajouter l'association (ignore si elle existe déjà)
    try {
      Database.prepare(`
        INSERT INTO file_tags (file_id, tag_id, created_at) 
        VALUES (?, ?, datetime('now'))
      `).run(fileId, tagId);
    } catch (error) {
      // Ignore l'erreur si l'association existe déjà
      if (!(error as Error).message.includes('UNIQUE constraint failed')) {
        throw error;
      }
    }
    
    res.json({
      success: true,
      message: 'Étiquette ajoutée au fichier'
    } as ApiResponse);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'ajout de l\'étiquette'
    } as ApiResponse);
  }
});

// Retirer une étiquette d'un fichier
router.delete('/:id/tags/:tagId', async (req: AuthenticatedRequest, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const tagId = parseInt(req.params.tagId);
    const userId = req.user!.id;
    
    if (isNaN(fileId) || isNaN(tagId)) {
      return res.status(400).json({
        success: false,
        error: 'IDs invalides'
      } as ApiResponse);
    }

    // Vérifier que le fichier appartient à l'utilisateur
    const file = await fileService.getFileById(fileId, userId);
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Fichier non trouvé'
      } as ApiResponse);
    }

    // Supprimer l'association
    const { Database } = await import('../database');
    const result = Database.prepare(`
      DELETE FROM file_tags 
      WHERE file_id = ? AND tag_id = ? 
      AND EXISTS (SELECT 1 FROM tags WHERE id = ? AND user_id = ?)
    `).run(fileId, tagId, tagId, userId);
    
    res.json({
      success: true,
      message: 'Étiquette retirée du fichier'
    } as ApiResponse);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'étiquette'
    } as ApiResponse);
  }
});

// Archiver un fichier
router.post('/:id/archive', async (req: AuthenticatedRequest, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const userId = req.user!.id;
    
    if (isNaN(fileId)) {
      return res.status(400).json({
        success: false,
        error: 'ID de fichier invalide'
      } as ApiResponse);
    }

    const { Database } = await import('../database');
    
    // Vérifier que le fichier appartient à l'utilisateur
    const file = Database.prepare('SELECT id FROM markdown_files WHERE id = ? AND user_id = ?').get(fileId, userId);
    if (!file) {
      return res.status(404).json({
        success: false,
        error: 'Fichier non trouvé'
      } as ApiResponse);
    }

    // Archiver le fichier
    Database.prepare(`
      UPDATE markdown_files 
      SET is_archived = 1, updated_at = datetime('now') 
      WHERE id = ? AND user_id = ?
    `).run(fileId, userId);

    // Récupérer le fichier mis à jour
    const updatedFile = await fileService.getFileById(fileId, userId);
    
    res.json({
      success: true,
      data: updatedFile,
      message: 'Fichier archivé avec succès'
    } as ApiResponse);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de l\'archivage'
    } as ApiResponse);
  }
});

export default router;
