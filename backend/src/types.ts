export interface User {
  id?: number;
  username: string;
  email: string;
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MarkdownFile {
  id?: number;
  user_id: number;
  title: string;
  content: string;
  file_path?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
