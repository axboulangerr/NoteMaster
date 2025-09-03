import { dbManager } from './database';
import { MarkdownFile } from './types';

export class FileService {
  
  async createFile(fileData: Omit<MarkdownFile, 'id' | 'created_at' | 'updated_at'>): Promise<MarkdownFile> {
    return new Promise((resolve, reject) => {
      const db = dbManager.getDatabase();
      const stmt = db.prepare(
        'INSERT INTO markdown_files (user_id, title, content, file_path) VALUES (?, ?, ?, ?)'
      );
      
      stmt.run([fileData.user_id, fileData.title, fileData.content, fileData.file_path || null], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        resolve({
          id: this.lastID,
          ...fileData
        });
      });
      
      stmt.finalize();
    });
  }

  async getFilesByUserId(userId: number): Promise<MarkdownFile[]> {
    return new Promise((resolve, reject) => {
      const db = dbManager.getDatabase();
      db.all(
        'SELECT * FROM markdown_files WHERE user_id = ? ORDER BY updated_at DESC',
        [userId],
        (err, rows: MarkdownFile[]) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows || []);
        }
      );
    });
  }

  async getFileById(fileId: number, userId: number): Promise<MarkdownFile | null> {
    return new Promise((resolve, reject) => {
      const db = dbManager.getDatabase();
      db.get(
        'SELECT * FROM markdown_files WHERE id = ? AND user_id = ?',
        [fileId, userId],
        (err, row: MarkdownFile) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row || null);
        }
      );
    });
  }

  async updateFile(fileId: number, userId: number, updates: Partial<Pick<MarkdownFile, 'title' | 'content'>>): Promise<MarkdownFile | null> {
    return new Promise((resolve, reject) => {
      const db = dbManager.getDatabase();
      
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
        reject(new Error('Aucune mise à jour fournie'));
        return;
      }
      
      fields.push('updated_at = CURRENT_TIMESTAMP');
      values.push(fileId, userId);
      
      const sql = `UPDATE markdown_files SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
      
      db.run(sql, values, function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        if (this.changes === 0) {
          resolve(null); // Fichier non trouvé
          return;
        }
        
        // Récupérer le fichier mis à jour
        db.get(
          'SELECT * FROM markdown_files WHERE id = ? AND user_id = ?',
          [fileId, userId],
          (err, row: MarkdownFile) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row || null);
          }
        );
      });
    });
  }

  async deleteFile(fileId: number, userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const db = dbManager.getDatabase();
      db.run(
        'DELETE FROM markdown_files WHERE id = ? AND user_id = ?',
        [fileId, userId],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve(this.changes > 0);
        }
      );
    });
  }

  async searchFiles(userId: number, searchTerm: string): Promise<MarkdownFile[]> {
    return new Promise((resolve, reject) => {
      const db = dbManager.getDatabase();
      const searchPattern = `%${searchTerm}%`;
      
      db.all(
        'SELECT * FROM markdown_files WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) ORDER BY updated_at DESC',
        [userId, searchPattern, searchPattern],
        (err, rows: MarkdownFile[]) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(rows || []);
        }
      );
    });
  }
}

export const fileService = new FileService();
