import React, { useState } from 'react';
import { ArrowLeft, Save, Send, CheckCircle, CreditCard as Edit3, Eye, Code, FileText } from 'lucide-react';
import { Story } from '../../types';
import { apiService } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import MDEditor from '@uiw/react-md-editor';

interface StoryDetailViewProps {
  story: Story;
  onBack: () => void;
  onUpdate: () => void;
}

const StoryDetailView: React.FC<StoryDetailViewProps> = ({ story, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [storyContent, setStoryContent] = useState(story.title || '');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');

  const handleSave = async () => {
    try {
      setActionLoading('save');
      // In a real implementation, this would update the story content
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Failed to save story:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePOReview = async () => {
    try {
      setActionLoading('po-review');
      await apiService.requestPOReview(story.id);
      onUpdate();
    } catch (error) {
      console.error('Failed to request PO review:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveForDev = async () => {
    try {
      setActionLoading('approve');
      // In a real implementation, this would approve the story for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdate();
    } catch (error) {
      console.error('Failed to approve story:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'RUNNING':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'DONE':
        return 'text-emerald-700 bg-emerald-100 border-emerald-300';
      case 'FAILED':
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'PO_REVIEW':
      case 'AWAITING_HUMAN':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const canSendForPOReview = story.status === 'DRAFT' || story.status === 'NEEDS_REVISION';
  const canApproveForDev = story.status === 'PO_REVIEW' || story.status === 'AWAITING_HUMAN';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Epics
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Story</h1>
            <div className="flex items-center space-x-3 mt-1">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(story.status)}`}>
                {story.status.replace('_', ' ')}
              </span>
              {story.story_points && (
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {story.story_points} pts
                </span>
              )}
              {story.size && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {story.size}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Story
            </button>
          )}

          {canSendForPOReview && (
            <button
              onClick={handlePOReview}
              disabled={actionLoading === 'po-review'}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              {actionLoading === 'po-review' ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send for PO Review
            </button>
          )}

          {canApproveForDev && (
            <button
              onClick={handleApproveForDev}
              disabled={actionLoading === 'approve'}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              {actionLoading === 'approve' ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Approve for Development
            </button>
          )}
        </div>
      </div>

      {/* Story Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Edit Story Content</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center ${
                      viewMode === 'preview' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode('edit')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center ${
                      viewMode === 'edit' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Code className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>

              <div data-color-mode="light">
                <MDEditor
                  value={storyContent}
                  onChange={(val) => setStoryContent(val || '')}
                  preview={viewMode === 'preview' ? 'preview' : 'edit'}
                  hideToolbar={viewMode === 'preview'}
                  visibleDragBar={false}
                  height={400}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setStoryContent(story.title || '');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={actionLoading === 'save'}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
                >
                  {actionLoading === 'save' ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-900">Story Details</h3>
              </div>
              
              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">{story.title}</p>
                </div>
              </div>

              {/* Story Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Story Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(story.status)}`}>
                        {story.status.replace('_', ' ')}
                      </span>
                    </div>
                    {story.size && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Size:</span>
                        <span className="text-sm font-medium text-gray-900">{story.size}</span>
                      </div>
                    )}
                    {story.risk && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Risk:</span>
                        <span className={`text-sm font-medium ${
                          story.risk === 'HIGH' ? 'text-red-600' :
                          story.risk === 'MEDIUM' ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          {story.risk}
                        </span>
                      </div>
                    )}
                    {story.story_points && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Story Points:</span>
                        <span className="text-sm font-medium text-gray-900">{story.story_points}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Assignment & Dependencies</h4>
                  <div className="space-y-2">
                    {story.assignee && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Assignee:</span>
                        <span className="text-sm font-medium text-gray-900">{story.assignee}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Dependencies:</span>
                      <span className={`text-sm font-medium ${story.dependencies_met ? 'text-emerald-600' : 'text-red-600'}`}>
                        {story.dependencies_met ? 'Met' : 'Not Met'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDetailView;