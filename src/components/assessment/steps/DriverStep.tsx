import React from 'react';
import { useFormContext } from 'react-hook-form';
import Input from '../../ui/Input';

const DriverStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Driver Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          {...register('driverDetails.name')}
          error={errors.driverDetails?.name?.message}
          placeholder="Enter driver's full name"
        />

        <Input
          label="License Number"
          {...register('driverDetails.licenseNumber')}
          error={errors.driverDetails?.licenseNumber?.message}
          placeholder="Enter license number"
        />

        <Input
          label="Age"
          type="number"
          {...register('driverDetails.age', { valueAsNumber: true })}
          error={errors.driverDetails?.age?.message}
          min={18}
          max={100}
        />

        <Input
          label="Years of Experience"
          type="number"
          {...register('driverDetails.experience', { valueAsNumber: true })}
          error={errors.driverDetails?.experience?.message}
          min={0}
          max={80}
        />

        <Input
          label="Previous Accidents"
          type="number"
          {...register('driverDetails.previousAccidents', { valueAsNumber: true })}
          error={errors.driverDetails?.previousAccidents?.message}
          min={0}
        />
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-sm text-yellow-700">
          Note: Driver history and experience significantly impact risk assessment and premium calculation.
        </p>
      </div>
    </div>
  );
};

export default DriverStep;