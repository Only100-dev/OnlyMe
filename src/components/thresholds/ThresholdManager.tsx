import React, { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useThresholdStore } from '../../store/useThresholdStore';
import { formatCurrency } from '../../utils/formatters';
import Button from '../ui/Button';
import ThresholdForm from './ThresholdForm';
import { useAuditLogger } from '../../hooks/useAuditLogger';

const ThresholdManager: React.FC = () => {
  const { thresholds, deleteThreshold } = useThresholdStore();
  const [showForm, setShowForm] = useState(false);
  const [editingThreshold, setEditingThreshold] = useState<string | null>(null);
  const logAction = useAuditLogger();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this threshold?')) {
      deleteThreshold(id);
      logAction('threshold_deleted', { thresholdId: id });
    }
  };

  const handleEdit = (id: string) => {
    setEditingThreshold(id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Financial Thresholds</h3>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Threshold</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {thresholds.map((threshold) => (
          <div
            key={threshold.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium capitalize">
                  {threshold.role.replace('_', ' ')}
                </h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Max Policy Value: {formatCurrency(threshold.maxPolicyValue)}</p>
                  <p>Max Risk Score: {threshold.maxRiskScore}%</p>
                  <p>
                    Escalation Required:{' '}
                    <span
                      className={
                        threshold.requiresEscalation
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }
                    >
                      {threshold.requiresEscalation ? 'Yes' : 'No'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(threshold.id)}
                  className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(threshold.id)}
                  className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ThresholdForm
          thresholdId={editingThreshold}
          onClose={() => {
            setShowForm(false);
            setEditingThreshold(null);
          }}
        />
      )}
    </div>
  );
};

export default ThresholdManager;