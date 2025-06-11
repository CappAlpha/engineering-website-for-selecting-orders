import { Category, Product } from "@prisma/client";

export type CategoryBase = Pick<Category, "id" | "name" | "slug">;

export interface CategoryWithDetails extends CategoryBase {
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}
