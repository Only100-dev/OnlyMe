import { useState } from 'react';
import { z } from 'zod';
import { assessmentSchema } from '../utils/validation';

interface ValidationResult {
  success: boolean;
  errors: Record<string, string[]>;
}

export function useAssessmentValidation() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const validate = (data: unknown): ValidationResult => {
    try {
      assessmentSchema.parse(data);
      setErrors({});
      return { success: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(err.message);
        });
        setErrors(formattedErrors);
        return { success: false, errors: formattedErrors };
      }
      return { success: false, errors: { general: ['An unexpected error occurred'] } };
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return errors[field]?.[0];
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    validate,
    getFieldError,
    clearErrors,
    errors,
  };
}