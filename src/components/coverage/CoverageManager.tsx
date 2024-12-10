import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useCoverageStore } from '../../store/useCoverageStore';
import { CoverageItem } from '../../types/coverage';
import CoverageList from './CoverageList';
import CoverageForm from './CoverageForm';
import Button from '../ui/Button';

const CoverageManager: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'inclusion' | 'exclusion'>('inclusion');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<CoverageItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { inclusions, exclusions, addItem, updateItem, deleteItem, toggleItemStatus, bulkDeleteItems } = useCoverageStore();

  const items = selectedCategory === 'inclusion' ? inclusions : exclusions;

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' ||
                         (activeFilter === 'active' && item.isActive) ||
                         (activeFilter === 'inactive' && !item.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleAdd = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: CoverageItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      bulkDeleteItems(selectedItems);
      setSelectedItems([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Coverage Management</h1>
          <p className="text-gray-600">Manage inclusion and exclusion lists</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setSelectedCategory('inclusion')}
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === 'inclusion'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Inclusions
        </button>
        <button
          onClick={() => setSelectedCategory('exclusion')}
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === 'exclusion'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Exclusions
        </button>
      </div>

      {selectedItems.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
          <span>{selectedItems.length} items selected</span>
          <Button
            variant="outline"
            onClick={handleBulkDelete}
            className="text-red-600 hover:text-red-700"
          >
            Delete Selected
          </Button>
        </div>
      )}

      <CoverageList
        items={filteredItems}
        category={selectedCategory}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={toggleItemStatus}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
      />

      {showForm && (
        <CoverageForm
          category={selectedCategory}
          initialData={editingItem}
          onSubmit={(data) => {
            if (editingItem) {
              updateItem(editingItem.id, data);
            } else {
              addItem(data);
            }
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default CoverageManager;