import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../../ui/Input';

const VehicleStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Vehicle Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Vehicle Model"
          {...register('vehicleModel')}
          error={errors.vehicleModel?.message}
          placeholder="e.g., Toyota Camry"
        />

        <Input
          label="Manufacturing Year"
          type="number"
          {...register('vehicleYear', { valueAsNumber: true })}
          error={errors.vehicleYear?.message}
          min={1900}
          max={currentYear + 1}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          Vehicle details are used to assess risk factors and determine appropriate coverage options.
        </p>
      </div>
    </div>
  );
};

export default VehicleStep;