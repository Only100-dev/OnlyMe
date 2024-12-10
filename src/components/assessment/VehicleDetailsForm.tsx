import React from 'react';
import Input from '../ui/Input';

interface VehicleDetailsFormProps {
  model: string;
  year: number;
  onChange: (field: 'model' | 'year', value: string | number) => void;
}

const VehicleDetailsForm: React.FC<VehicleDetailsFormProps> = ({
  model,
  year,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Vehicle Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Vehicle Model"
          value={model}
          onChange={(e) => onChange('model', e.target.value)}
          placeholder="Enter vehicle model"
        />
        <Input
          label="Year"
          type="number"
          value={year}
          onChange={(e) => onChange('year', Number(e.target.value))}
          min={1900}
          max={new Date().getFullYear() + 1}
        />
      </div>
    </div>
  );
};

export default VehicleDetailsForm;