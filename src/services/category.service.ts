import { api } from "@/core/api";
import { CategoryResponse } from "@/types/novel";

export const categoryService = {
  getAllCategories: async (): Promise<CategoryResponse[]> => {
    const response = await api.get<CategoryResponse[]>("/categories");
    return response.data;
  },
};

