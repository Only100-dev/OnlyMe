import React from 'react';
import { Filter, Search, Calendar } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import Input from '../ui/Input';

interface DataFilterManagerProps {
  onFilterChange: (filters: DataFilters) => void;
}

interface DataFilters {
  status?: string;
  dateRange?: { start: Date | null; end: Date | null };
  search?: string;
  riskLevel?: string;
}

const DataFilterManager: React.FC<DataFilterManagerProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<DataFilters>({});

  const handleFilterChange = (key: keyof DataFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search assessments..."
            icon={<Search className="w-4 h-4" />}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="w-48">
          <select
            className="w-full px-3 py-2 border rounded-lg"
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
        </div>

        <div className="w-48">
          <select
            className="w-full px-3 py-2 border rounded-lg"
            onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            className="px-3 py-2 border rounded-lg"
            onChange={(e) => handleFilterChange('dateRange', {
              ...filters.dateRange,
              start: e.target.value ? new Date(e.target.value) : null,
            })}
          />
          <span>to</span>
          <input
            type="date"
            className="px-3 py-2 border rounded-lg"
            onChange={(e) => handleFilterChange('dateRange', {
              ...filters.dateRange,
              end: e.target.value ? new Date(e.target.value) : null,
            })}
          />
        </div>
      </div>

      {Object.keys(filters).length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Active Filters:</span>
            {Object.entries(filters).map(([key, value]) => (
              value && (
                <span key={key} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {key}: {value.toString()}
                </span>
              )
            ))}
          </div>
          <button
            onClick={() => {
              setFilters({});
              onFilterChange({});
            }}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default DataFilterManager;