import React from 'react';
import Input from '../ui/Input';
import { DriverDetails } from '../../types/assessment';

interface DriverDetailsFormProps {
  value: DriverDetails;
  onChange: (value: DriverDetails) => void;
}

const DriverDetailsForm: React.FC<DriverDetailsFormProps> = ({ value, onChange }) => {
  const handleChange = (field: keyof DriverDetails) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Driver Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={value.name}
          onChange={handleChange('name')}
          placeholder="Enter driver's full name"
        />
        <Input
          label="License Number"
          value={value.licenseNumber}
          onChange={handleChange('licenseNumber')}
          placeholder="Enter license number"
        />
        <Input
          label="Age"
          type="number"
          value={value.age}
          onChange={handleChange('age')}
          min={18}
          max={100}
        />
        <Input
          label="Years of Experience"
          type="number"
          value={value.experience}
          onChange={handleChange('experience')}
          min={0}
          max={80}
        />
        <Input
          label="Previous Accidents"
          type="number"
          value={value.previousAccidents}
          onChange={handleChange('previousAccidents')}
          min={0}
        />
      </div>
    </div>
  );
};

export default DriverDetailsForm;