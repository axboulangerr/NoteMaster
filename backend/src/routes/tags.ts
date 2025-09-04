import express, { Request, Response } from 'express';
import { Database } from '../database';
import { Tag } from '../types';

const router = express.Router();

// GET /api/tags - Récupérer toutes les étiquettes de l'utilisateur
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const tags = Database.prepare(`
      SELECT id, name, color, user_id, created_at 
      FROM tags 
      WHERE user_id = ? 
      ORDER BY name ASC
    `).all(userId) as Tag[];

    res.json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des étiquettes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des étiquettes'
    });
  }
});

// POST /api/tags - Créer une nouvelle étiquette
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({
        success: false,
        error: 'Le nom et la couleur sont requis'
      });
    }

    // Vérifier si une étiquette avec ce nom existe déjà pour cet utilisateur
    const existingTag = Database.prepare(`
      SELECT id FROM tags WHERE user_id = ? AND name = ?
    `).get(userId, name);

    if (existingTag) {
      return res.status(400).json({
        success: false,
        error: 'Une étiquette avec ce nom existe déjà'
      });
    }

    const result = Database.prepare(`
      INSERT INTO tags (name, color, user_id, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `).run(name, color, userId);

    const newTag = Database.prepare(`
      SELECT id, name, color, user_id, created_at 
      FROM tags 
      WHERE id = ?
    `).get(result.lastInsertRowid) as Tag;

    res.status(201).json({
      success: true,
      data: newTag
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'étiquette:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'étiquette'
    });
  }
});

// PUT /api/tags/:id - Mettre à jour une étiquette
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tagId = parseInt(req.params.id);
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({
        success: false,
        error: 'Le nom et la couleur sont requis'
      });
    }

    // Vérifier que l'étiquette appartient à l'utilisateur
    const existingTag = Database.prepare(`
      SELECT id FROM tags WHERE id = ? AND user_id = ?
    `).get(tagId, userId);

    if (!existingTag) {
      return res.status(404).json({
        success: false,
        error: 'Étiquette non trouvée'
      });
    }

    // Vérifier si une autre étiquette avec ce nom existe déjà
    const duplicateTag = Database.prepare(`
      SELECT id FROM tags WHERE user_id = ? AND name = ? AND id != ?
    `).get(userId, name, tagId);

    if (duplicateTag) {
      return res.status(400).json({
        success: false,
        error: 'Une étiquette avec ce nom existe déjà'
      });
    }

    Database.prepare(`
      UPDATE tags 
      SET name = ?, color = ? 
      WHERE id = ? AND user_id = ?
    `).run(name, color, tagId, userId);

    const updatedTag = Database.prepare(`
      SELECT id, name, color, user_id, created_at 
      FROM tags 
      WHERE id = ?
    `).get(tagId) as Tag;

    res.json({
      success: true,
      data: updatedTag
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étiquette:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de l\'étiquette'
    });
  }
});

// DELETE /api/tags/:id - Supprimer une étiquette
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tagId = parseInt(req.params.id);

    // Vérifier que l'étiquette appartient à l'utilisateur
    const existingTag = Database.prepare(`
      SELECT id FROM tags WHERE id = ? AND user_id = ?
    `).get(tagId, userId);

    if (!existingTag) {
      return res.status(404).json({
        success: false,
        error: 'Étiquette non trouvée'
      });
    }

    // Supprimer les associations avec les fichiers
    Database.prepare(`
      DELETE FROM file_tags WHERE tag_id = ?
    `).run(tagId);

    // Supprimer l'étiquette
    Database.prepare(`
      DELETE FROM tags WHERE id = ? AND user_id = ?
    `).run(tagId, userId);

    res.json({
      success: true,
      message: 'Étiquette supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étiquette:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de l\'étiquette'
    });
  }
});

export default router;