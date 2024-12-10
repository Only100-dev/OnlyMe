import { create } from 'zustand';
import { Assessment, CommentFormData } from '../types/assessment';

interface AssessmentStore {
  assessments: Assessment[];
  addAssessment: (assessment: Assessment) => void;
  updateAssessment: (id: string, assessment: Partial<Assessment>) => void;
  addComment: (assessmentId: string, comment: CommentFormData) => void;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
  assessments: [],
  
  addAssessment: (assessment) =>
    set((state) => ({
      assessments: [...state.assessments, {
        ...assessment,
        trackingNumber: `RA-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        comments: [],
      }],
    })),
    
  updateAssessment: (id, updates) =>
    set((state) => ({
      assessments: state.assessments.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      ),
    })),
    
  addComment: (assessmentId, comment) =>
    set((state) => ({
      assessments: state.assessments.map((assessment) =>
        assessment.id === assessmentId
          ? {
              ...assessment,
              comments: [
                ...assessment.comments,
                {
                  id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  text: comment.text,
                  author: 'System User', // In a real app, get from auth context
                  createdAt: new Date(),
                  isInternal: comment.isInternal,
                },
              ],
              updatedAt: new Date(),
            }
          : assessment
      ),
    })),
}));