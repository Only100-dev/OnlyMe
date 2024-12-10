import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';

const ReviewStep: React.FC = () => {
  const { watch } = useFormContext();
  const formData = watch();

  const sections = [
    {
      title: 'Vehicle Details',
      fields: [
        { label: 'Model', value: formData.vehicleModel },
        { label: 'Year', value: formData.vehicleYear },
      ],
    },
    {
      title: 'Driver Information',
      fields: [
        { label: 'Name', value: formData.driverDetails?.name },
        { label: 'License Number', value: formData.driverDetails?.licenseNumber },
        { label: 'Age', value: formData.driverDetails?.age },
        { label: 'Experience', value: `${formData.driverDetails?.experience} years` },
      ],
    },
    {
      title: 'Coverage Details',
      fields: [
        { label: 'Type', value: formData.coverageDetails?.type },
        { label: 'Amount', value: `${formData.coverageDetails?.amount} AED` },
        { label: 'Deductible', value: `${formData.coverageDetails?.deductible} AED` },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <h3 className="text-lg font-semibold">Review Assessment Details</h3>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 mb-3">{section.title}</h4>
            <dl className="grid grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.label}>
                  <dt className="text-sm text-gray-500">{field.label}</dt>
                  <dd className="text-sm font-medium">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">Uploaded Documents</h4>
          <ul className="space-y-2">
            {formData.documents?.map((file: File, index: number) => (
              <li key={index} className="text-sm">
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          Please review all information carefully before submitting. Once submitted,
          the assessment will be processed according to UAE insurance regulations.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;