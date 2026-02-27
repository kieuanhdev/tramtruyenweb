export interface UserCreateRequest {
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  status: string;
  createdAt: string;
}

