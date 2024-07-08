interface ProductBase {
  id: number;
  name: string;
  imagem: string;
  description?: string;
  createdAt?: Date;
  deletedAt?: Date;
}

interface ProductCreate {
  name: string;
  id_category: number;
  description?: string;
  imagem: string;
}

export type { ProductBase, ProductCreate };
