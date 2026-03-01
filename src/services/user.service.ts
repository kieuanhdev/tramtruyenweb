import { api } from "@/core/api";
import {
  UserCreateRequest,
  UserResponse,
  UserUpdateRequest,
} from "@/types/user";

export const userService = {
  createUser: async (data: UserCreateRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>("/users", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>("/users/me");
    return response.data;
  },

  updateCurrentUser: async (
    data: UserUpdateRequest
  ): Promise<UserResponse> => {
    const response = await api.put<UserResponse>("/users/me", data);
    return response.data;
  },
};