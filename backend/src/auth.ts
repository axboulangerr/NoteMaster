import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database } from './database';
import { User, AuthRequest, RegisterRequest, AuthResponse } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class AuthService {
  
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const { username, email, password } = userData;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.findUserByUsernameOrEmail(username, email);
    if (existingUser) {
      throw new Error('Un utilisateur avec ce nom d\'utilisateur ou email existe déjà');
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Créer l'utilisateur
    const user = await this.createUser({
      username,
      email,
      password_hash
    });

    // Générer le token JWT
    const token = this.generateToken(user.id!);

    return {
      token,
      user: {
        id: user.id!,
        username: user.username,
        email: user.email
      }
    };
  }

  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const { username, password } = credentials;

    // Trouver l'utilisateur
    const user = await this.findUserByUsername(username);
    if (!user) {
      throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password_hash!);
    if (!isValidPassword) {
      throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
    }

    // Générer le token JWT
    const token = this.generateToken(user.id!);

    return {
      token,
      user: {
        id: user.id!,
        username: user.username,
        email: user.email
      }
    };
  }

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  }

  verifyToken(token: string): { userId: number } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      return decoded;
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  private async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const result = Database.prepare(`
      INSERT INTO users (username, email, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `).run(user.username, user.email, user.password_hash);

    const newUser = Database.prepare(`
      SELECT * FROM users WHERE id = ?
    `).get(result.lastInsertRowid) as User;

    return newUser;
  }

  private async findUserByUsername(username: string): Promise<User | null> {
    const user = Database.prepare(`
      SELECT * FROM users WHERE username = ?
    `).get(username) as User | undefined;

    return user || null;
  }

  private async findUserByUsernameOrEmail(username: string, email: string): Promise<User | null> {
    const user = Database.prepare(`
      SELECT * FROM users WHERE username = ? OR email = ?
    `).get(username, email) as User | undefined;

    return user || null;
  }

  async findUserById(id: number): Promise<User | null> {
    const user = Database.prepare(`
      SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?
    `).get(id) as User | undefined;

    return user || null;
  }
}

export const authService = new AuthService();
