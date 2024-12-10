import React from 'react';
import { Bar } from 'react-chartjs-2';
import { FinancialThreshold } from '../../types/thresholds';
import { formatCurrency } from '../../utils/formatters';

interface ThresholdVisualizationProps {
  thresholds: FinancialThreshold[];
}

const ThresholdVisualization: React.FC<ThresholdVisualizationProps> = ({ thresholds }) => {
  const data = {
    labels: thresholds.map(t => t.role.replace('_', ' ').toUpperCase()),
    datasets: [
      {
        label: 'Maximum Policy Value',
        data: thresholds.map(t => t.maxPolicyValue),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Risk Score Limit',
        data: thresholds.map(t => t.maxRiskScore * 1000), // Scale for visualization
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return label === 'Maximum Policy Value' 
              ? `${label}: ${formatCurrency(value)}`
              : `${label}: ${value / 1000}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Threshold Distribution</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ThresholdVisualization;