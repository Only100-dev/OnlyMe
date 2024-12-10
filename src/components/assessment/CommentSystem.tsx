import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare, Edit2, Trash2, Lock } from 'lucide-react';
import { Comment, CommentFormData, commentSchema } from '../../types/assessment';
import Button from '../ui/Button';
import { formatDate } from '../../utils/formatters';
import { useAuditLogger } from '../../hooks/useAuditLogger';

interface CommentSystemProps {
  assessmentId: string;
  comments: Comment[];
  onAddComment: (data: CommentFormData) => void;
  onEditComment: (id: string, text: string) => void;
  onDeleteComment: (id: string) => void;
}

const CommentSystem: React.FC<CommentSystemProps> = ({
  assessmentId,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'internal' | 'external'>('all');
  const logAction = useAuditLogger();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const filteredComments = comments.filter(comment => {
    if (filter === 'internal') return comment.isInternal;
    if (filter === 'external') return !comment.isInternal;
    return true;
  });

  const handleCommentSubmit = (data: CommentFormData) => {
    onAddComment(data);
    logAction('comment_added', {
      assessmentId,
      isInternal: data.isInternal,
    });
    reset();
  };

  const handleEdit = (id: string, text: string) => {
    onEditComment(id, text);
    logAction('comment_edited', { assessmentId, commentId: id });
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDeleteComment(id);
      logAction('comment_deleted', { assessmentId, commentId: id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-500" />
          <h3 className="font-medium">Assessment Comments</h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="text-sm border rounded-md px-2 py-1"
          >
            <option value="all">All Comments</option>
            <option value="internal">Internal Only</option>
            <option value="external">External Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg ${
                comment.isInternal
                  ? 'bg-yellow-50 border border-yellow-100'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex justify-between mb-2">
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

              {editingId === comment.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    handleEdit(comment.id, formData.get('text') as string);
                  }}
                  className="space-y-2"
                >
                  <textarea
                    name="text"
                    defaultValue={comment.text}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start">
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setEditingId(comment.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(handleCommentSubmit)} className="space-y-4">
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

export default CommentSystem;