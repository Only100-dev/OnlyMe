import React from 'react';
import { CoverageDetails } from '../../types/assessment';
import Input from '../ui/Input';

interface CoverageDetailsFormProps {
  value: CoverageDetails;
  onChange: (value: CoverageDetails) => void;
}

const coverageTypes = [
  { value: 'liability', label: 'Liability' },
  { value: 'comprehensive', label: 'Comprehensive' },
  { value: 'collision', label: 'Collision' },
] as const;

const additionalCoverageOptions = [
  'Personal Accident Cover',
  'Medical Payments',
  'Roadside Assistance',
  'Rental Car Coverage',
  'New for Old Replacement',
  'Custom Parts Coverage',
];

const CoverageDetailsForm: React.FC<CoverageDetailsFormProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof CoverageDetails, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  const toggleAdditionalCoverage = (coverage: string) => {
    const newCoverages = value.additionalCoverages.includes(coverage)
      ? value.additionalCoverages.filter((c) => c !== coverage)
      : [...value.additionalCoverages, coverage];
    handleChange('additionalCoverages', newCoverages);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Coverage Details</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Coverage Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            {coverageTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange('type', type.value)}
                className={`p-4 border rounded-lg text-center ${
                  value.type === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Coverage Amount (AED)"
            type="number"
            value={value.amount}
            onChange={(e) => handleChange('amount', Number(e.target.value))}
            min={0}
            step={1000}
          />
          <Input
            label="Deductible (AED)"
            type="number"
            value={value.deductible}
            onChange={(e) => handleChange('deductible', Number(e.target.value))}
            min={0}
            step={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Coverage Options
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {additionalCoverageOptions.map((coverage) => (
              <label
                key={coverage}
                className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  value.additionalCoverages.includes(coverage)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  checked={value.additionalCoverages.includes(coverage)}
                  onChange={() => toggleAdditionalCoverage(coverage)}
                />
                <span className="ml-2 text-sm">{coverage}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageDetailsForm;