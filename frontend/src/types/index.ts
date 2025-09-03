export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface MarkdownFile {
  id?: number;
  user_id?: number;
  title: string;
  content: string;
  file_path?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ConversionResult {
  title: string;
  content: string;
  originalFilename: string;
  warnings?: string[];
}
