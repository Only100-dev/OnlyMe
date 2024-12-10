import { AxiosError } from 'axios';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    return new AppError(
      error.response?.data?.message || error.message,
      error.response?.data?.code || 'API_ERROR',
      error.response?.status,
      error.response?.data?.details
    );
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof AxiosError && !error.response;
}

export function isRateLimitError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 429;
}