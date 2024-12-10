import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare, Lock } from 'lucide-react';
import { Comment, CommentFormData, commentSchema } from '../../types/assessment';
import Button from '../ui/Button';
import { formatDate } from '../../utils/formatters';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (data: CommentFormData) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = (data: CommentFormData) => {
    onAddComment(data);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageSquare className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold">Comments</h3>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Comments List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg ${
                comment.isInternal
                  ? 'bg-yellow-50 border border-yellow-100'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{comment.author}</span>
                  {comment.isInternal && (
                    <div className="flex items-center space-x-1 text-yellow-600 text-sm">
                      <Lock className="w-3 h-3" />
                      <span>Internal</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <textarea
              {...register('text')}
              rows={3}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isInternal')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Mark as internal note</span>
            </label>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isSubmitting ? 'Adding...' : 'Add Comment'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentsSection;