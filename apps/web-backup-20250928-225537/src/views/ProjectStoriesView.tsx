import React, { useState } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { Story, Epic } from '../types';
import { apiService } from '../services/api';
import StoryCard from '../components/stories/StoryCard';
import StoryForm from '../components/stories/StoryForm';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ProjectStoriesViewProps {
  projectId: number;
  stories: Story[];
  epics: Epic[];
  onStoriesUpdate: () => void;
}

const ProjectStoriesView: React.FC<ProjectStoriesViewProps> = ({ 
  projectId, 
  stories, 
  epics,
  onStoriesUpdate 
}) => {
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const handleCreateStory = async (epicId: number, title: string) => {
    try {
      setActionLoading(0);
      const newStory = await apiService.createStory(epicId, title);
      onStoriesUpdate();
      setShowStoryForm(false);
    } catch (error) {
      console.error('Failed to create story:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePOReview = async (storyId: number) => {
    try {
      setActionLoading(storyId);
      const result = await apiService.requestPOReview(storyId);
      onStoriesUpdate();
    } catch (error) {
      console.error('Failed to request PO review:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusCounts = () => {
    return stories.reduce((acc, story) => {
      acc[story.status] = (acc[story.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Stories</h2>
          <p className="mt-1 text-gray-500">Track and manage user stories for this project</p>
        </div>
        <button
          onClick={() => setShowStoryForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Story
        </button>
      </div>

      {/* Status Overview */}
      {stories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-500 capitalize">
                {status.replace('_', ' ').toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      )}

      {stories.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="No stories yet"
          description="Create your first user story to start tracking development work."
          action={{
            label: "Create Story",
            onClick: () => setShowStoryForm(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stories.map(story => (
            <StoryCard
              key={story.id}
              story={story}
              onClick={() => {/* TODO: Navigate to story detail */}}
              onPOReview={story.status === 'DRAFT' ? () => handlePOReview(story.id) : undefined}
            />
          ))}
        </div>
      )}

      {showStoryForm && (
        <StoryForm
          onSubmit={handleCreateStory}
          onCancel={() => setShowStoryForm(false)}
          loading={actionLoading === 0}
          epicId={epics.length > 0 ? epics[0].id : 1}
        />
      )}
    </div>
  );
};

export default ProjectStoriesView;