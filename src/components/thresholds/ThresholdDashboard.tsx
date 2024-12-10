import React from 'react';
import { useThresholdStore } from '../../store/useThresholdStore';
import ThresholdManager from './ThresholdManager';
import ThresholdVisualization from './ThresholdVisualization';
import ApprovalTrends from './ApprovalTrends';
import EscalationRules from './EscalationRules';

const ThresholdDashboard: React.FC = () => {
  const thresholds = useThresholdStore((state) => state.thresholds);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Financial Thresholds</h1>
        <p className="text-gray-600">Manage approval thresholds and escalation rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ThresholdVisualization thresholds={thresholds} />
        <ApprovalTrends />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <ThresholdManager />
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <EscalationRules />
      </div>
    </div>
  );
};

export default ThresholdDashboard;