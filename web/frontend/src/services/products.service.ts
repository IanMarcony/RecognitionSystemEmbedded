import api from "../api";
import type { ProductBase, ProductCreate } from "../models/product.interface";

export default abstract class ProductService {
  static async create(Product: ProductCreate): Promise<boolean> {
    await api.post("/products/", Product);
    return true;
  }

  static async getOne(id: number): Promise<ProductBase> {
    const product = (await api.get<ProductBase>(`/products/${id}`)).data;
    return product;
  }

  static async getAll(): Promise<ProductBase[]> {
    const product = (await api.get<ProductBase[]>(`/products/`)).data;
    return product;
  }

  static async update(product: ProductBase): Promise<void> {
    await api.put<Pick<ProductBase, "id">>(`/products/${product.id}`, product);
  }

  static async delete(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  }
}
