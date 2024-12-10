import React from 'react';
import { X } from 'lucide-react';
import { Document, DocumentCategory } from '../../types/document';

interface DocumentEditModalProps {
  document: Document;
  onClose: () => void;
  onSave: (updates: Partial<Document>) => void;
}

const categories: { value: DocumentCategory; label: string }[] = [
  { value: 'driver_license', label: 'Driver License' },
  { value: 'vehicle_registration', label: 'Vehicle Registration' },
  { value: 'insurance_policy', label: 'Insurance Policy' },
  { value: 'claims_history', label: 'Claims History' },
  { value: 'inspection_report', label: 'Inspection Report' },
  { value: 'other', label: 'Other' },
];

const DocumentEditModal: React.FC<DocumentEditModalProps> = ({
  document,
  onClose,
  onSave,
}) => {
  const [name, setName] = React.useState(document.name);
  const [category, setCategory] = React.useState(document.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Document</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentEditModal;