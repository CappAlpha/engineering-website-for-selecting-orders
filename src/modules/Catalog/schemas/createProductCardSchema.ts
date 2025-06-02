import { z } from "zod";

export const createProductCardSchema = z.object({
  category: z.string(),
  imageUrl: z.string(),
  name: z.string(),
  description: z.string().optional(),
  tags: z.string().optional(),
  price: z.string(),
});

export type TCreateProductCardSchema = z.infer<typeof createProductCardSchema>;
