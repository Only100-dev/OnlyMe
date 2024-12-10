import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useThresholdStore } from '../../store/useThresholdStore';
import Button from '../ui/Button';
import { EscalationRule } from '../../types/thresholds';

const EscalationRules: React.FC = () => {
  const [editingRule, setEditingRule] = useState<EscalationRule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { thresholds, updateThreshold } = useThresholdStore();

  const handleAddRule = () => {
    setEditingRule(null);
    setShowForm(true);
  };

  const handleEditRule = (rule: EscalationRule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  const handleDeleteRule = (thresholdId: string, ruleId: string) => {
    const threshold = thresholds.find(t => t.escalationRules?.some(r => r.id === ruleId));
    if (threshold) {
      const updatedRules = threshold.escalationRules?.filter(r => r.id !== ruleId) || [];
      updateThreshold(thresholdId, { escalationRules: updatedRules });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Escalation Rules</h3>
        <Button onClick={handleAddRule} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </Button>
      </div>

      <div className="space-y-4">
        {thresholds.map((threshold) => (
          threshold.escalationRules?.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    {rule.condition.toUpperCase()} Threshold: {rule.threshold}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Escalate to: {rule.escalateTo.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Auto-escalate: {rule.autoEscalate ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRule(rule)}
                    className="p-1 text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRule(threshold.id, rule.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default EscalationRules;