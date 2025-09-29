import React, { useState, useEffect } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Story } from '../types';
import { apiService } from '../services/api';
import StoryCard from '../components/stories/StoryCard';
import StoryForm from '../components/stories/StoryForm';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StoriesView: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await apiService.getStories();
      setStories(data);
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (epicId: number, title: string) => {
    try {
      setActionLoading(0);
      const newStory = await apiService.createStory(epicId, title);
      setStories([...stories, newStory]);
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
      
      // Update the story with the new status
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, ...result.story }
          : story
      ));
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Stories</h1>
          <p className="mt-1 text-gray-500">
            Track and manage user stories across all projects
          </p>
        </div>
        <button
          onClick={() => setShowStoryForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Story
        </button>
      </div>

      {/* Status Overview */}
      {stories.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
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
          icon={FileText}
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
        />
      )}
    </div>
  );
};

export default StoriesView;