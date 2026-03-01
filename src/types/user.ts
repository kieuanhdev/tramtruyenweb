export interface UserCreateRequest {
  email: string;
  password: string;
  fullName: string;
  avatarUrl?: string;
  dateOfBirth?: string | null;
}

export interface UserUpdateRequest {
  fullName: string;
  avatarUrl?: string | null;
  dateOfBirth?: string | null;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  role: string;
  status: string;
  createdAt: string;
}

