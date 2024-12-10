import { apiClient } from './client';
import { Assessment } from '../types/assessment';
import { Document } from '../types/document';

// Assessment endpoints
export const assessmentApi = {
  create: (data: Partial<Assessment>) => 
    apiClient.post<Assessment>('/assessments', data),
    
  update: (id: string, data: Partial<Assessment>) =>
    apiClient.put<Assessment>(`/assessments/${id}`, data),
    
  delete: (id: string) =>
    apiClient.delete(`/assessments/${id}`),
    
  getById: (id: string) =>
    apiClient.get<Assessment>(`/assessments/${id}`),
    
  getAll: () =>
    apiClient.get<Assessment[]>('/assessments'),
};

// Document endpoints
export const documentApi = {
  upload: (file: File, metadata: Partial<Document>) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    return apiClient.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  delete: (id: string) =>
    apiClient.delete(`/documents/${id}`),
    
  getById: (id: string) =>
    apiClient.get<Document>(`/documents/${id}`),
    
  getAll: () =>
    apiClient.get<Document[]>('/documents'),
};

// Risk assessment endpoints
export const riskApi = {
  analyze: (assessmentId: string) =>
    apiClient.post(`/risk-assessment/${assessmentId}/analyze`),
    
  getFactors: (assessmentId: string) =>
    apiClient.get(`/risk-assessment/${assessmentId}/factors`),
};

// Compliance endpoints
export const complianceApi = {
  check: (assessmentId: string) =>
    apiClient.post(`/compliance/${assessmentId}/check`),
    
  getRegulations: () =>
    apiClient.get('/compliance/regulations'),
};