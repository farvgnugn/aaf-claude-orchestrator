import React from 'react';
import { CheckCircle, Clock, AlertCircle, Play, XCircle, FileText } from 'lucide-react';
import { Story } from '../../types';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
  onPOReview?: () => void;
  compact?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onClick, onPOReview, compact = false }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'RUNNING':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'DONE':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'FAILED':
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'PO_REVIEW':
      case 'AWAITING_HUMAN':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`flex items-center space-x-2 ${compact ? 'mb-2' : 'mb-3'}`}>
            <FileText className={`text-blue-600 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <h3 className={`font-medium text-gray-900 group-hover:text-blue-700 line-clamp-2 ${compact ? 'text-sm' : ''}`}>
              {story.title}
            </h3>
          </div>
          
          <div className={`flex items-center ${compact ? 'space-x-2' : 'space-x-4'}`}>
            <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium border ${getStatusColor(story.status)} ${compact ? 'text-xs' : 'text-xs'}`}>
              {getStatusIcon(story.status)}
              <span className="ml-1">{story.status.replace('_', ' ')}</span>
            </span>

            {story.dependencies_met && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 ${compact ? 'text-xs' : 'text-xs'}`}>
                <CheckCircle className={`mr-1 ${compact ? 'h-2 w-2' : 'h-3 w-3'}`} />
                {compact ? 'Deps Met' : 'Dependencies Met'}
              </span>
            )}

            {story.size && !compact && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {story.size}
              </span>
            )}

            {story.risk && !compact && (
              <span className={`text-xs px-2 py-1 rounded ${
                story.risk === 'HIGH' ? 'text-red-600 bg-red-100' :
                story.risk === 'MEDIUM' ? 'text-amber-600 bg-amber-100' :
                'text-emerald-600 bg-emerald-100'
              }`}>
                {story.risk} Risk
              </span>
            )}

            {story.story_points && !compact && (
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {story.story_points} pts
              </span>
            )}
          </div>

          {story.assignee && !compact && (
            <div className="mt-2 text-xs text-gray-500">
              Assigned to: {story.assignee}
            </div>
          )}
        </div>

        {story.status === 'DRAFT' && onPOReview && !compact && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPOReview();
            }}
            className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
          >
            Request PO Review
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryCard;