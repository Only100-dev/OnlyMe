import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { ThresholdFormData, thresholdSchema } from '../../types/thresholds';
import { useThresholdStore } from '../../store/useThresholdStore';
import Button from '../ui/Button';
import { useAuditLogger } from '../../hooks/useAuditLogger';

interface ThresholdFormProps {
  thresholdId?: string | null;
  onClose: () => void;
}

const ThresholdForm: React.FC<ThresholdFormProps> = ({ thresholdId, onClose }) => {
  const { thresholds, addThreshold, updateThreshold } = useThresholdStore();
  const logAction = useAuditLogger();

  const editingThreshold = thresholdId
    ? thresholds.find((t) => t.id === thresholdId)
    : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ThresholdFormData>({
    resolver: zodResolver(thresholdSchema),
    defaultValues: editingThreshold || {
      role: 'underwriter',
      maxPolicyValue: 250000,
      maxRiskScore: 40,
      requiresEscalation: false,
    },
  });

  const onSubmit = (data: ThresholdFormData) => {
    if (editingThreshold) {
      updateThreshold(editingThreshold.id, data);
      logAction('threshold_updated', {
        thresholdId: editingThreshold.id,
        updates: data,
      });
    } else {
      addThreshold(data);
      logAction('threshold_added', { data });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">
            {editingThreshold ? 'Edit' : 'Add'} Threshold
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              {...register('role')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="underwriter">Underwriter</option>
              <option value="senior_underwriter">Senior Underwriter</option>
              <option value="manager">Manager</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Policy Value (AED)
            </label>
            <input
              type="number"
              {...register('maxPolicyValue', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.maxPolicyValue && (
              <p className="mt-1 text-sm text-red-600">
                {errors.maxPolicyValue.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Risk Score (%)
            </label>
            <input
              type="number"
              {...register('maxRiskScore', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
            {errors.maxRiskScore && (
              <p className="mt-1 text-sm text-red-600">
                {errors.maxRiskScore.message}
              </p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('requiresEscalation')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Requires Escalation
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThresholdForm;