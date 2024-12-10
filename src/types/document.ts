export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  category: DocumentCategory;
  status: DocumentStatus;
  url: string;
}

export type DocumentCategory =
  | 'driver_license'
  | 'vehicle_registration'
  | 'insurance_policy'
  | 'claims_history'
  | 'inspection_report'
  | 'other';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface DocumentStore {
  documents: Document[];
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  getDocumentsByCategory: (category: DocumentCategory) => Document[];
}