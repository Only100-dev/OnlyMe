import { useState, useCallback } from 'react';
import { useAuditLogger } from './useAuditLogger';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

export function useWorkflowComments(assessmentId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const logAction = useAuditLogger();

  const addComment = useCallback(
    (text: string) => {
      const newComment: Comment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        author: 'System User', // In a real app, get from auth context
        timestamp: new Date(),
      };

      setComments((prev) => [...prev, newComment]);
      logAction('comment_added', {
        assessmentId,
        commentId: newComment.id,
      });
    },
    [assessmentId, logAction]
  );

  const getComments = useCallback(() => comments, [comments]);

  return {
    comments,
    addComment,
    getComments,
  };
}