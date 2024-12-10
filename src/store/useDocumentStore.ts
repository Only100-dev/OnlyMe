import { create } from 'zustand';
import { Document, DocumentCategory, DocumentStore } from '../types/document';

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  addDocument: (document) =>
    set((state) => ({
      documents: [...state.documents, document],
    })),
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
  getDocumentsByCategory: (category: DocumentCategory) =>
    get().documents.filter((doc) => doc.category === category),
}));