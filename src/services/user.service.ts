import { api } from '@/core/api';
import { UserCreateRequest, UserResponse } from '@/types/user';

export const userService = {
  createUser: async (data: UserCreateRequest): Promise<UserResponse> => {
    const response = await api.post<UserResponse>('/users', data);
    return response.data;
  },
};

