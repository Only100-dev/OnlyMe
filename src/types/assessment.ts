import { z } from 'zod';

export type AssessmentStatus = 'pending' | 'approved' | 'denied';

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: Date;
  isInternal: boolean;
}

export interface Assessment {
  id: string;
  status: AssessmentStatus;
  vehicleModel: string;
  vehicleYear: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  documents: string[];
  riskFactors: RiskFactor[];
  driverDetails: DriverDetails;
  coverageDetails: CoverageDetails;
  trackingNumber: string;
}

export interface RiskFactor {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface DriverDetails {
  name: string;
  licenseNumber: string;
  age: number;
  experience: number;
  previousAccidents: number;
}

export interface CoverageDetails {
  type: 'liability' | 'comprehensive' | 'collision';
  amount: number;
  deductible: number;
  additionalCoverages: string[];
}

export const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
  isInternal: z.boolean().default(false),
});

export type CommentFormData = z.infer<typeof commentSchema>;