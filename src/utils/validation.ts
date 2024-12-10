import { z } from 'zod';

export const driverDetailsSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  licenseNumber: z.string().min(5, 'License number must be at least 5 characters'),
  age: z.number().min(18, 'Driver must be at least 18 years old').max(100, 'Invalid age'),
  experience: z.number().min(0, 'Experience cannot be negative'),
  previousAccidents: z.number().min(0, 'Number of accidents cannot be negative'),
});

export const coverageDetailsSchema = z.object({
  type: z.enum(['liability', 'comprehensive', 'collision']),
  amount: z.number().min(1000, 'Coverage amount must be at least 1,000 AED'),
  deductible: z.number().min(0, 'Deductible cannot be negative'),
  additionalCoverages: z.array(z.string()),
});

export const vehicleDetailsSchema = z.object({
  model: z.string().min(2, 'Vehicle model must be at least 2 characters'),
  year: z.number()
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
});

export const assessmentSchema = z.object({
  vehicleDetails: vehicleDetailsSchema,
  driverDetails: driverDetailsSchema,
  coverageDetails: coverageDetailsSchema,
});