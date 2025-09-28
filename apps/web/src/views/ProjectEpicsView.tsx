import React, { useState } from 'react';
import { Plus, FileText, ChevronRight, ChevronDown, Users } from 'lucide-react';
import { Epic, Story } from '../types';
import { apiService } from '../services/api';
import StoryCard from '../components/stories/StoryCard';
import StoryDetailView from '../components/stories/StoryDetailView';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ProjectEpicsViewProps {
  projectId: number;
  epics: Epic[];
  stories: Story[];
  onEpicsUpdate: () => void;
}

const ProjectEpicsView: React.FC<ProjectEpicsViewProps> = ({ 
  projectId, 
  epics, 
  stories,
  onEpicsUpdate 
}) => {
  const [showEpicForm, setShowEpicForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedEpics, setExpandedEpics] = useState<Set<number>>(new Set());
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleCreateEpic = async (title: string) => {
    try {
      setActionLoading(true);
      // In a real implementation, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      onEpicsUpdate();
      setShowEpicForm(false);
    } catch (error) {
      console.error('Failed to create epic:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleEpicExpansion = (epicId: number) => {
    const newExpanded = new Set(expandedEpics);
    if (newExpanded.has(epicId)) {
      newExpanded.delete(epicId);
    } else {
      newExpanded.add(epicId);
    }
    setExpandedEpics(newExpanded);
  };

  const getEpicStories = (epicId: number) => {
    return stories.filter(story => story.epic_id === epicId);
  };

  const handleStoryUpdate = () => {
    onEpicsUpdate(); // This will refresh both epics and stories
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'PLANNING':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (selectedStory) {
    return (
      <StoryDetailView
        story={selectedStory}
        onBack={() => setSelectedStory(null)}
        onUpdate={handleStoryUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Epics</h2>
          <p className="mt-1 text-gray-500">Manage project epics and their progress</p>
        </div>
        <button
          onClick={() => setShowEpicForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Epic
        </button>
      </div>

      {epics.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No epics yet"
          description="Create your first epic to start organizing user stories and features."
          action={{
            label: "Create Epic",
            onClick: () => setShowEpicForm(true)
          }}
        />
      ) : (
        <div className="space-y-4">
          {epics.map(epic => (
            <div key={epic.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleEpicExpansion(epic.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {expandedEpics.has(epic.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{epic.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(epic.status)}`}>
                          {epic.status.replace('_', ' ')}
                        </span>
                        {epic.priority && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(epic.priority)}`}>
                            {epic.priority}
                          </span>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          {getEpicStories(epic.id).length} stories
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {epic.description && (
                  <p className="text-gray-600 text-sm mt-3 ml-8 line-clamp-2">{epic.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mt-3 ml-8">
                  <div className="flex space-x-4">
                    {epic.start_date && (
                      <span>Started: {new Date(epic.start_date).toLocaleDateString()}</span>
                    )}
                    {epic.target_date && (
                      <span>Target: {new Date(epic.target_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>

              {expandedEpics.has(epic.id) && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">User Stories</h4>
                  </div>
                  
                  {getEpicStories(epic.id).length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No stories in this epic yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {getEpicStories(epic.id).map(story => (
                        <StoryCard
                          key={story.id}
                          story={story}
                          onClick={() => setSelectedStory(story)}
                          compact={true}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showEpicForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Epic</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const title = formData.get('title') as string;
              if (title.trim()) {
                handleCreateEpic(title.trim());
              }
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Epic Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter epic title..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEpicForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
                >
                  {actionLoading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Epic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectEpicsView;