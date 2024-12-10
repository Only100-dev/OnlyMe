import React from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { CoverageItem } from '../../types/coverage';
import Button from '../ui/Button';
import { formatDate } from '../../utils/formatters';

interface CoverageListProps {
  items: CoverageItem[];
  category: 'inclusion' | 'exclusion';
  onAdd: () => void;
  onEdit: (item: CoverageItem) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const CoverageList: React.FC<CoverageListProps> = ({
  items,
  category,
  onAdd,
  onEdit,
  onDelete,
  onToggle,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold capitalize">{category}s</h3>
        <Button
          onClick={onAdd}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add {category}</span>
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-xs text-gray-500">
                  Last updated: {formatDate(item.updatedAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggle(item.id)}
                  className={`p-1 rounded-full transition-colors ${
                    item.isActive
                      ? 'text-green-600 hover:text-green-700'
                      : 'text-gray-400 hover:text-gray-500'
                  }`}
                  title={item.isActive ? 'Active' : 'Inactive'}
                >
                  {item.isActive ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={() => onEdit(item)}
                  className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-1 text-red-600 hover:text-red-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoverageList;