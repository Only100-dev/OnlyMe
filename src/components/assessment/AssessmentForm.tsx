import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assessmentSchema } from '../../utils/validation';
import VehicleDetailsForm from './VehicleDetailsForm';
import DriverDetailsForm from './DriverDetailsForm';
import CoverageDetailsForm from './CoverageDetailsForm';
import DocumentUpload from './DocumentUpload';
import Button from '../ui/Button';
import { Assessment } from '../../types/assessment';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { useAuditLogger } from '../../hooks/useAuditLogger';

const AssessmentForm: React.FC = () => {
  const addAssessment = useAssessmentStore((state) => state.addAssessment);
  const logAction = useAuditLogger();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      vehicleDetails: {
        model: '',
        year: new Date().getFullYear(),
      },
      driverDetails: {
        name: '',
        licenseNumber: '',
        age: 25,
        experience: 0,
        previousAccidents: 0,
      },
      coverageDetails: {
        type: 'comprehensive',
        amount: 0,
        deductible: 0,
        additionalCoverages: [],
      },
      documents: [],
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const assessment: Assessment = {
        id: `RA-${Date.now()}`,
        status: 'pending',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        comments: [],
        riskFactors: [],
      };

      addAssessment(assessment);
      logAction('assessment_created', { assessmentId: assessment.id });

      // Reset form or redirect
    } catch (error) {
      console.error('Failed to create assessment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
        <VehicleDetailsForm
          register={register}
          errors={errors.vehicleDetails}
          watch={watch}
        />

        <DriverDetailsForm
          register={register}
          errors={errors.driverDetails}
          watch={watch}
        />

        <CoverageDetailsForm
          register={register}
          errors={errors.coverageDetails}
          watch={watch}
          setValue={setValue}
        />

        <DocumentUpload
          onUpload={(files) => setValue('documents', files)}
          error={errors.documents?.message}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Assessment...' : 'Create Assessment'}
        </Button>
      </div>
    </form>
  );
};

export default AssessmentForm;