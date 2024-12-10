import { apiClient } from './api/apiClient';

const API_ENDPOINTS = [
  import.meta.env.VITE_API_BASE_URL,
  import.meta.env.VITE_API_BACKUP_URL,
].filter(Boolean);

let currentEndpointIndex = 0;
let failureCount = 0;
const MAX_FAILURES = 3;

export function switchEndpoint(): void {
  currentEndpointIndex = (currentEndpointIndex + 1) % API_ENDPOINTS.length;
  apiClient.defaults.baseURL = API_ENDPOINTS[currentEndpointIndex];
  failureCount = 0;
}

export function handleFailure(): void {
  failureCount++;
  if (failureCount >= MAX_FAILURES && API_ENDPOINTS.length > 1) {
    switchEndpoint();
  }
}

export function resetFailureCount(): void {
  failureCount = 0;
}

export function getCurrentEndpoint(): string {
  return API_ENDPOINTS[currentEndpointIndex];
}