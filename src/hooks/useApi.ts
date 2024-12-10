import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from 'react-query';
import { AxiosError } from 'axios';
import { useAuditLogger } from './useAuditLogger';

interface ApiHookOptions<TData, TError> extends UseQueryOptions<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

export function useApi<TData = unknown, TError = AxiosError>(
  key: string[],
  fetcher: () => Promise<TData>,
  options?: ApiHookOptions<TData, TError>
) {
  const logAction = useAuditLogger();

  return useQuery<TData, TError>(
    key,
    async () => {
      try {
        const data = await fetcher();
        logAction('api_request_success', { key, data });
        return data;
      } catch (error) {
        logAction('api_request_error', { key, error });
        throw error;
      }
    },
    {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      ...options,
    }
  );
}

export function useApiMutation<TData = unknown, TVariables = unknown, TError = AxiosError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  const logAction = useAuditLogger();

  return useMutation<TData, TError, TVariables>(
    async (variables) => {
      try {
        const data = await mutationFn(variables);
        logAction('api_mutation_success', { data });
        return data;
      } catch (error) {
        logAction('api_mutation_error', { error });
        throw error;
      }
    },
    options
  );
}