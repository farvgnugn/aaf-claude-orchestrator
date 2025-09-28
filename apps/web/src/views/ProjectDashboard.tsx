import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Users, 
  FileText, 
  Archive, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Settings,
  Play,
  Plus
} from 'lucide-react';
import { Project, Epic, Story, SubAgent, Artifact } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProjectAgentsView from './ProjectAgentsView';
import ProjectEpicsView from './ProjectEpicsView';
import ProjectStoriesView from './ProjectStoriesView';
import ProjectArtifactsView from './ProjectArtifactsView';

interface ProjectDashboardProps {
  projectId: number;
  onBackToProjects: () => void;
}

type DashboardView = 'overview' | 'agents' | 'epics' | 'stories' | 'artifacts';

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projectId, onBackToProjects }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [agents, setAgents] = useState<SubAgent[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<DashboardView>('overview');

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const [projectData, epicsData, storiesData, agentsData, artifactsData] = await Promise.all([
        apiService.getProject(projectId),
        apiService.getEpics(projectId),
        apiService.getStories(),
        apiService.getAgents(projectId),
        apiService.getArtifacts(projectId)
      ]);
      
      setProject(projectData);
      setEpics(epicsData);
      // Filter stories for this project's epics
      const projectEpicIds = epicsData.map(e => e.id);
      setStories(storiesData.filter(s => projectEpicIds.includes(s.epic_id)));
      setAgents(agentsData);
      setArtifacts(artifactsData);
    } catch (error) {
      console.error('Failed to load project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetrics = () => {
    const totalStories = stories.length;
    const completedStories = stories.filter(s => s.status === 'DONE').length;
    const totalEpics = epics.length;
    const completedEpics = epics.filter(e => e.status === 'DONE').length;
    const activeAgents = agents.filter(a => a.enabled).length;
    const storiesInProgress = stories.filter(s => s.status === 'RUNNING').length;
    const storiesAwaitingReview = stories.filter(s => s.status === 'PO_REVIEW' || s.status === 'AWAITING_HUMAN').length;

    return {
      storyCompletion: totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0,
      epicCompletion: totalEpics > 0 ? Math.round((completedEpics / totalEpics) * 100) : 0,
      activeAgents,
      totalAgents: agents.length,
      storiesInProgress,
      storiesAwaitingReview,
      totalStories,
      totalEpics
    };
  };

  const metrics = getMetrics();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'agents':
        return <ProjectAgentsView projectId={projectId} agents={agents} onAgentsUpdate={loadProjectData} />;
      case 'epics':
        return <ProjectEpicsView projectId={projectId} epics={epics} stories={stories} onEpicsUpdate={loadProjectData} />;
      case 'artifacts':
        return <ProjectArtifactsView projectId={projectId} artifacts={artifacts} onArtifactsUpdate={loadProjectData} />;
      default:
        return (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-gradient rounded-xl shadow-lg border border-dark-600 p-6 card-hover">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-dark-400">Story Completion</p>
                    <p className="text-2xl font-bold text-white">{metrics.storyCompletion}%</p>
                  </div>
                </div>
              </div>

              <div className="card-gradient rounded-xl shadow-lg border border-dark-600 p-6 card-hover">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-dark-400">Epic Completion</p>
                    <p className="text-2xl font-bold text-white">{metrics.epicCompletion}%</p>
                  </div>
                </div>
              </div>

              <div className="card-gradient rounded-xl shadow-lg border border-dark-600 p-6 card-hover">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-dark-400">Active Agents</p>
                    <p className="text-2xl font-bold text-white">{metrics.activeAgents}/{metrics.totalAgents}</p>
                  </div>
                </div>
              </div>

              <div className="card-gradient rounded-xl shadow-lg border border-dark-600 p-6 card-hover">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-amber-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-dark-400">In Progress</p>
                    <p className="text-2xl font-bold text-white">{metrics.storiesInProgress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-gradient rounded-xl shadow-lg border border-dark-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Project Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-400">Total Epics</span>
                    <span className="font-medium text-white">{metrics.totalEpics}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-400">Total Stories</span>
                    <span className="font-medium text-white">{metrics.totalStories}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-400">Stories Awaiting Review</span>
                    <span className="font-medium text-amber-400">{metrics.storiesAwaitingReview}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-400">Repository Status</span>
                    <span className={`font-medium ${project.repo_ready ? 'text-emerald-400' : 'text-red-400'}`}>
                      {project.repo_ready ? 'Ready' : 'Not Ready'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card-gradient rounded-xl shadow-lg border border-dark-600 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-dark-300">3 stories completed this week</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Play className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-dark-300">{metrics.storiesInProgress} stories in progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-dark-300">{metrics.storiesAwaitingReview} stories need review</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="text-sm text-dark-300">{metrics.activeAgents} agents active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 mr-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{project.name}</h2>
            
            {/* Repository Link */}
            {project.repo_url && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  View Repository
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1">
              <button
                onClick={() => setCurrentView('overview')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'overview'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Settings className="h-4 w-4 mr-3" />
                Overview
              </button>

              <button
                onClick={() => setCurrentView('agents')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'agents'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users className="h-4 w-4 mr-3" />
                Manage Agents
                <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {agents.length}
                </span>
              </button>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Project Structure</p>
                
                <button
                  onClick={() => setCurrentView('epics')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'epics'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-3" />
                  Epics
                  <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {epics.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentView('stories')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'stories'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <CheckCircle className="h-4 w-4 mr-3" />
                  User Stories
                  <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {stories.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentView('artifacts')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentView === 'artifacts'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Archive className="h-4 w-4 mr-3" />
                  Artifacts
                  <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {artifacts.length}
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;