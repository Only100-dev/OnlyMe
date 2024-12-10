import React, { useState } from 'react';
import { useCoverageStore } from '../store/useCoverageStore';
import { CoverageItem, CoverageItemFormData } from '../types/coverage';
import CoverageList from '../components/coverage/CoverageList';
import CoverageForm from '../components/coverage/CoverageForm';
import { useAuditLogger } from '../hooks/useAuditLogger';

const CoverageManagement: React.FC = () => {
  const { inclusions, exclusions, addItem, updateItem, deleteItem, toggleItemStatus } =
    useCoverageStore();
  const logAction = useAuditLogger();

  const [formData, setFormData] = useState<{
    show: boolean;
    category: 'inclusion' | 'exclusion';
    item?: CoverageItem;
  }>({
    show: false,
    category: 'inclusion',
  });

  const handleAdd = (category: 'inclusion' | 'exclusion') => {
    setFormData({ show: true, category });
  };

  const handleEdit = (item: CoverageItem) => {
    setFormData({ show: true, category: item.category, item });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
      logAction('coverage_item_deleted', { itemId: id });
    }
  };

  const handleSubmit = (data: CoverageItemFormData) => {
    if (formData.item) {
      updateItem(formData.item.id, data);
      logAction('coverage_item_updated', {
        itemId: formData.item.id,
        updates: data,
      });
    } else {
      addItem(data);
      logAction('coverage_item_added', { data });
    }
    setFormData({ show: false, category: 'inclusion' });
  };

  const handleToggle = (id: string) => {
    toggleItemStatus(id);
    logAction('coverage_item_toggled', { itemId: id });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Coverage Management</h1>
        <p className="text-gray-600">
          Manage inclusion and exclusion lists for motor risk assessment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CoverageList
          items={inclusions}
          category="inclusion"
          onAdd={() => handleAdd('inclusion')}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />

        <CoverageList
          items={exclusions}
          category="exclusion"
          onAdd={() => handleAdd('exclusion')}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      </div>

      {formData.show && (
        <CoverageForm
          category={formData.category}
          initialData={formData.item}
          onSubmit={handleSubmit}
          onClose={() => setFormData({ show: false, category: 'inclusion' })}
        />
      )}
    </div>
  );
};

export default CoverageManagement;