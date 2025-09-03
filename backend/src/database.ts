import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

export class DatabaseManager {
  private db: Database;

  constructor() {
    const dbPath = path.join(__dirname, '..', 'data', 'notemaster.db');
    
    // Créer le dossier data s'il n'existe pas
    const dataDir = path.dirname(dbPath);
    if (!require('fs').existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }
    
    this.db = new sqlite3.Database(dbPath);
    this.initializeTables();
  }

  private initializeTables(): void {
    // Table des utilisateurs
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) console.error('Erreur création table users:', err);
      });

      // Table des fichiers markdown
      this.db.run(`
        CREATE TABLE IF NOT EXISTS markdown_files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          file_path TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) console.error('Erreur création table markdown_files:', err);
      });

      // Index pour améliorer les performances
      this.db.run('CREATE INDEX IF NOT EXISTS idx_files_user_id ON markdown_files(user_id)');
      this.db.run('CREATE INDEX IF NOT EXISTS idx_files_title ON markdown_files(title)');
    });
  }

  getDatabase(): Database {
    return this.db;
  }

  close(): void {
    this.db.close();
  }
}

export const dbManager = new DatabaseManager();
