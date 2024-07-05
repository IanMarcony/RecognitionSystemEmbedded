interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  deletedAt?: Date;
}

export type { Category };
