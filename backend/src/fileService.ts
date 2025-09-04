import { Database } from './database';
import { MarkdownFile, Tag } from './types';

export class FileService {
  
  async createFile(fileData: Omit<MarkdownFile, 'id' | 'created_at' | 'updated_at'>): Promise<MarkdownFile> {
    const result = Database.prepare(`
      INSERT INTO markdown_files (user_id, title, content, file_path, is_archived, is_shared, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      fileData.user_id, 
      fileData.title, 
      fileData.content, 
      fileData.file_path || null,
      fileData.is_archived ? 1 : 0,
      fileData.is_shared ? 1 : 0
    );

    const newFile = Database.prepare(`
      SELECT * FROM markdown_files WHERE id = ?
    `).get(result.lastInsertRowid) as MarkdownFile;

    // Récupérer les étiquettes (vide pour un nouveau fichier)
    newFile.tags = [];
    
    return newFile;
  }

  async getFilesByUserId(userId: number): Promise<MarkdownFile[]> {
    const files = Database.prepare(`
      SELECT * FROM markdown_files 
      WHERE user_id = ? 
      ORDER BY updated_at DESC
    `).all(userId) as MarkdownFile[];

    // Récupérer les étiquettes pour chaque fichier
    for (const file of files) {
      file.tags = this.getFileTagsSync(file.id!);
    }

    return files;
  }

  async getFileById(fileId: number, userId: number): Promise<MarkdownFile | null> {
    const file = Database.prepare(`
      SELECT * FROM markdown_files 
      WHERE id = ? AND user_id = ?
    `).get(fileId, userId) as MarkdownFile | undefined;

    if (!file) return null;

    // Récupérer les étiquettes
    file.tags = this.getFileTagsSync(fileId);
    
    return file;
  }

  private getFileTagsSync(fileId: number): Tag[] {
    return Database.prepare(`
      SELECT t.id, t.name, t.color, t.user_id, t.created_at
      FROM tags t
      INNER JOIN file_tags ft ON t.id = ft.tag_id
      WHERE ft.file_id = ?
      ORDER BY t.name
    `).all(fileId) as Tag[];
  }

  async updateFile(fileId: number, userId: number, updates: Partial<Pick<MarkdownFile, 'title' | 'content'>>): Promise<MarkdownFile | null> {
    // Construire la requête dynamiquement
    const fields = [];
    const values = [];
    
    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    
    if (updates.content !== undefined) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    
    if (fields.length === 0) {
      throw new Error('Aucune mise à jour fournie');
    }
    
    fields.push('updated_at = datetime(\'now\')');
    values.push(fileId, userId);
    
    const sql = `UPDATE markdown_files SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
    
    const result = Database.prepare(sql).run(...values);
    
    if (result.changes === 0) {
      return null; // Fichier non trouvé
    }
    
    // Récupérer le fichier mis à jour
    return this.getFileById(fileId, userId);
  }

  async deleteFile(fileId: number, userId: number): Promise<boolean> {
    // Supprimer d'abord les associations avec les étiquettes
    Database.prepare('DELETE FROM file_tags WHERE file_id = ?').run(fileId);
    
    // Supprimer le fichier
    const result = Database.prepare(`
      DELETE FROM markdown_files WHERE id = ? AND user_id = ?
    `).run(fileId, userId);
    
    return result.changes > 0;
  }

  async searchFiles(userId: number, searchTerm: string): Promise<MarkdownFile[]> {
    const searchPattern = `%${searchTerm}%`;
    
    const files = Database.prepare(`
      SELECT * FROM markdown_files 
      WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) 
      ORDER BY updated_at DESC
    `).all(userId, searchPattern, searchPattern) as MarkdownFile[];

    // Récupérer les étiquettes pour chaque fichier
    for (const file of files) {
      file.tags = this.getFileTagsSync(file.id!);
    }

    return files;
  }
}

export const fileService = new FileService();
