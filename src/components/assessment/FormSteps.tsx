import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assessmentSchema } from '../../utils/validation';
import { Assessment } from '../../types/assessment';
import Button from '../ui/Button';
import VehicleStep from './steps/VehicleStep';
import DriverStep from './steps/DriverStep';
import CoverageStep from './steps/CoverageStep';
import DocumentStep from './steps/DocumentStep';
import ReviewStep from './steps/ReviewStep';

const steps = [
  { id: 'vehicle', title: 'Vehicle Details', Component: VehicleStep },
  { id: 'driver', title: 'Driver Information', Component: DriverStep },
  { id: 'coverage', title: 'Coverage Details', Component: CoverageStep },
  { id: 'documents', title: 'Required Documents', Component: DocumentStep },
  { id: 'review', title: 'Review & Submit', Component: ReviewStep },
];

interface FormStepsProps {
  onSubmit: (data: Assessment) => void;
}

const FormSteps: React.FC<FormStepsProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const methods = useForm({
    resolver: zodResolver(assessmentSchema),
    mode: 'onChange',
  });

  const nextStep = async () => {
    const isValid = await methods.trigger(steps[currentStep].id);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data as Assessment);
  });

  const CurrentStepComponent = steps[currentStep].Component;

  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        {/* Progress Indicator */}
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
            />
          </div>
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <span className="text-sm">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Step */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <CurrentStepComponent />
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button type="submit" onClick={handleSubmit}>
              Submit Assessment
            </Button>
          ) : (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default FormSteps;