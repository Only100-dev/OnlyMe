import React from 'react';
import { Filter, Search } from 'lucide-react';
import { DocumentCategory } from '../../types/document';

interface DocumentFiltersProps {
  category: DocumentCategory | 'all';
  search: string;
  onCategoryChange: (category: DocumentCategory | 'all') => void;
  onSearchChange: (search: string) => void;
}

const categories: { value: DocumentCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Documents' },
  { value: 'driver_license', label: 'Driver License' },
  { value: 'vehicle_registration', label: 'Vehicle Registration' },
  { value: 'insurance_policy', label: 'Insurance Policy' },
  { value: 'claims_history', label: 'Claims History' },
  { value: 'inspection_report', label: 'Inspection Report' },
  { value: 'other', label: 'Other' },
];

const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  category,
  search,
  onCategoryChange,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search documents..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as DocumentCategory | 'all')}
          className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DocumentFilters;