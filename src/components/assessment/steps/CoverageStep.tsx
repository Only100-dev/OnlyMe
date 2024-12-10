import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../../ui/Input';

const coverageTypes = [
  { value: 'liability', label: 'Liability Only' },
  { value: 'comprehensive', label: 'Comprehensive' },
  { value: 'collision', label: 'Collision' },
];

const additionalCoverages = [
  'Personal Accident Cover',
  'Medical Payments',
  'Roadside Assistance',
  'Rental Car Coverage',
  'New for Old Replacement',
];

const CoverageStep: React.FC = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const selectedType = watch('coverageDetails.type');

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
              <label
                key={type.value}
                className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                  selectedType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  {...register('coverageDetails.type')}
                  value={type.value}
                  className="sr-only"
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Coverage Amount (AED)"
            type="number"
            {...register('coverageDetails.amount', { valueAsNumber: true })}
            error={errors.coverageDetails?.amount?.message}
            min={0}
            step={1000}
          />

          <Input
            label="Deductible (AED)"
            type="number"
            {...register('coverageDetails.deductible', { valueAsNumber: true })}
            error={errors.coverageDetails?.deductible?.message}
            min={0}
            step={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Coverage Options
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {additionalCoverages.map((coverage) => (
              <label
                key={coverage}
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  value={coverage}
                  {...register('coverageDetails.additionalCoverages')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">{coverage}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-700">
          Comprehensive coverage provides the highest level of protection for your vehicle.
        </p>
      </div>
    </div>
  );
};

export default CoverageStep;