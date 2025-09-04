export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  created_at?: string;
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
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  user_id?: number;
  tags?: Tag[];
  is_shared?: boolean;
  is_archived?: boolean;
  shared_with?: SharedUser[];
}

export interface Tag {
  id?: number;
  name: string;
  color: string;
  user_id?: number;
  created_at?: string;
}

export interface SharedUser {
  id: number;
  email: string;
  permission: 'view' | 'edit';
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
