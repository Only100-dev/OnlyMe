import { z } from 'zod';

export interface CoverageItem {
  id: string;
  name: string;
  description: string;
  category: 'inclusion' | 'exclusion';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const coverageItemSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['inclusion', 'exclusion']),
  isActive: z.boolean(),
});

export type CoverageItemFormData = z.infer<typeof coverageItemSchema>;