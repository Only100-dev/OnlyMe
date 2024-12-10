import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import { formatDate } from '../../utils/formatters';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

interface WorkflowCommentsProps {
  assessmentId: string;
  comments: Comment[];
  onAddComment: (text: string) => void;
}

const WorkflowComments: React.FC<WorkflowCommentsProps> = ({
  assessmentId,
  comments,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-gray-500" />
        <h3 className="font-medium">Assessment Comments</h3>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 rounded-lg p-3 space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium">{comment.author}</span>
                <span className="text-gray-500">
                  {formatDate(comment.timestamp)}
                </span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim()}>
              Add Comment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkflowComments;