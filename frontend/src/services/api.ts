import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  MarkdownFile 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configuration d'axios avec intercepteurs
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer l'expiration du token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ApiService {
  // Authentification
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post('/auth/login', credentials);
    return response.data.data!;
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await api.post('/auth/register', userData);
    return response.data.data!;
  }

  // Gestion des fichiers
  static async getFiles(searchTerm?: string): Promise<MarkdownFile[]> {
    const params = searchTerm ? { search: searchTerm } : {};
    const response: AxiosResponse<ApiResponse<MarkdownFile[]>> = await api.get('/files', { params });
    return response.data.data!;
  }

  static async getFile(id: number): Promise<MarkdownFile> {
    const response: AxiosResponse<ApiResponse<MarkdownFile>> = await api.get(`/files/${id}`);
    return response.data.data!;
  }

  static async createFile(fileData: Pick<MarkdownFile, 'title' | 'content'>): Promise<MarkdownFile> {
    const response: AxiosResponse<ApiResponse<MarkdownFile>> = await api.post('/files', fileData);
    return response.data.data!;
  }

  static async updateFile(id: number, updates: Partial<Pick<MarkdownFile, 'title' | 'content'>>): Promise<MarkdownFile> {
    const response: AxiosResponse<ApiResponse<MarkdownFile>> = await api.put(`/files/${id}`, updates);
    return response.data.data!;
  }

  static async deleteFile(id: number): Promise<void> {
    await api.delete(`/files/${id}`);
  }

  // Conversion de documents
  static async convertDocument(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('document', file);
    
    const response: AxiosResponse<ApiResponse> = await api.post('/convert/convert', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  }

  static async convertHtmlToMarkdown(html: string): Promise<{ markdown: string }> {
    const response: AxiosResponse<ApiResponse> = await api.post('/convert/html-to-markdown', { html });
    return response.data.data!;
  }

  // Test de santé du serveur
  static async healthCheck(): Promise<any> {
    const response: AxiosResponse<ApiResponse> = await api.get('/health');
    return response.data;
  }
}

export default ApiService;
