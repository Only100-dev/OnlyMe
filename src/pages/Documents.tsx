import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import DocumentUploader from '../components/documents/DocumentUploader';
import DocumentList from '../components/documents/DocumentList';
import DocumentAnalysis from '../components/documents/DocumentAnalysis';
import { useDocumentStore } from '../store/useDocumentStore';
import { useAuditLogger } from '../hooks/useAuditLogger';
import { DocumentCategory } from '../types/document';

const documentCategories: { value: DocumentCategory; label: string }[] = [
  { value: 'driver_license', label: 'Driver License' },
  { value: 'vehicle_registration', label: 'Vehicle Registration' },
  { value: 'insurance_policy', label: 'Insurance Policy' },
  { value: 'claims_history', label: 'Claims History' },
  { value: 'inspection_report', label: 'Inspection Report' },
  { value: 'other', label: 'Other Documents' },
];

const Documents = () => {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory>('driver_license');
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const { documents, deleteDocument } = useDocumentStore();
  const logAction = useAuditLogger();

  const handleDelete = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (document) {
      deleteDocument(id);
      logAction('document_deleted', { documentId: id, name: document.name });
    }
  };

  const handleDownload = (doc: Document) => {
    window.open(doc.url, '_blank');
  };

  const filteredDocuments = documents.filter(doc => doc.category === activeCategory);
  const selectedDocumentData = documents.find(doc => doc.id === selectedDocument);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Document Management</h1>
        <p className="text-gray-600">Upload and manage assessment documents</p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as DocumentCategory)}>
            <TabsList>
              {documentCategories.map((category) => (
                <TabsTrigger key={category.value} value={category.value}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {documentCategories.map((category) => (
              <TabsContent key={category.value} value={category.value}>
                <div className="space-y-6">
                  <DocumentUploader category={category.value} />
                  
                  <DocumentList
                    documents={filteredDocuments}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                    onSelect={setSelectedDocument}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div>
          {selectedDocumentData ? (
            <DocumentAnalysis document={selectedDocumentData} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
              Select a document to view analysis
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;