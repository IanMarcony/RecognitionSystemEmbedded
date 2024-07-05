import api from "../api";
import type {
  CategoryBase,
  CategoryCreate,
} from "../models/category.interface";

export default abstract class CategoryService {
  static async create(category: CategoryCreate): Promise<boolean> {
    await api.post("/categories", category);
    return true;
  }

  static async getOne(id: number): Promise<CategoryBase> {
    const category = (await api.get<CategoryBase>(`/categories/${id}`)).data;
    return category;
  }

  static async getAll(): Promise<CategoryBase[]> {
    const category = (await api.get<CategoryBase[]>(`/categories`)).data;
    return category;
  }

  static async update(category: CategoryBase): Promise<boolean> {
    const result = (
      await api.put<Pick<CategoryBase, "id">>(
        `/categories/${category.id}`,
        category,
      )
    ).data;
    return result.id === category.id;
  }

  static async delete(id: number): Promise<boolean> {
    await api.delete(`/categories/${id}`);
    return true;
  }
}
