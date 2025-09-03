import express from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import TurndownService from 'turndown';
import { AuthenticatedRequest } from '../middleware';
import { ApiResponse } from '../types';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom unique pour le fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepter seulement les fichiers .doc et .docx
    const allowedExtensions = ['.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers .doc et .docx sont acceptés'));
    }
  }
});

// Service de conversion HTML vers Markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
  linkStyle: 'inlined'
});

// Convertir un fichier DOC/DOCX en Markdown
router.post('/convert', upload.single('document'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier fourni'
      } as ApiResponse);
    }

    const filePath = req.file.path;
    
    try {
      // Convertir le document en HTML avec mammoth
      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;
      
      // Convertir HTML en Markdown avec turndown
      const markdown = turndownService.turndown(html);
      
      // Nettoyer le fichier uploadé
      fs.unlinkSync(filePath);
      
      // Extraire le nom du fichier sans extension pour le titre
      const originalName = path.parse(req.file.originalname).name;
      
      res.json({
        success: true,
        data: {
          title: originalName,
          content: markdown,
          originalFilename: req.file.originalname,
          warnings: result.messages || []
        },
        message: 'Conversion réussie'
      } as ApiResponse);
      
    } catch (conversionError) {
      // Nettoyer le fichier en cas d'erreur
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      throw conversionError;
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la conversion du fichier'
    } as ApiResponse);
  }
});

// Endpoint pour tester la conversion d'un texte HTML vers Markdown
router.post('/html-to-markdown', async (req: AuthenticatedRequest, res) => {
  try {
    const { html } = req.body;
    
    if (!html || typeof html !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Contenu HTML requis'
      } as ApiResponse);
    }
    
    const markdown = turndownService.turndown(html);
    
    res.json({
      success: true,
      data: {
        markdown,
        originalHtml: html
      },
      message: 'Conversion HTML vers Markdown réussie'
    } as ApiResponse);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur lors de la conversion HTML vers Markdown'
    } as ApiResponse);
  }
});

export default router;
