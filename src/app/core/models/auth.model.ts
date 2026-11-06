export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AdminUserDto;
}

export interface AdminUserDto {
  id: string;
  email: string;
  displayName: string;
}

