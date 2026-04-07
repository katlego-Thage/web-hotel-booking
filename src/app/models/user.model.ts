export interface User {
  userID: number;
  username: string;
  passwordHash?: string;
  email: string;
  roleID?: number;
  createdAt?: Date;
  roleName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  passwordHash: string;
  roleID?: number;
}

export interface UpdateUserRequest {
  userID: number;
  username: string;
  email: string;
  roleID?: number;
}
