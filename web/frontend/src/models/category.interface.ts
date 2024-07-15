interface CategoryBase {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  deletedAt?: Date;
}

interface CategoryCreate {
  name: string;
  description?: string;
}

export type { CategoryBase, CategoryCreate };
