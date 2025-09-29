import React, { useState, useEffect } from 'react';
import { ArrowLeft, Archive, RotateCcw, Trash2, Search } from 'lucide-react';
import { Project } from '../types';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';

interface ArchiveViewProps {
  onBackToProjects: () => void;
}

const ArchiveView: React.FC<ArchiveViewProps> = ({ onBackToProjects }) => {
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    loadArchivedProjects();
  }, []);

  const loadArchivedProjects = async () => {
    try {
      // Simulate archived projects - in real app this would be a separate API call
      const allProjects = await apiService.getProjects();
      // For demo, we'll show some projects as "archived"
      const archived = allProjects.slice(2).map(project => ({
        ...project,
        archived: true,
        archived_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      }));
      setArchivedProjects(archived);
    } catch (error) {
      console.error('Failed to load archived projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (projectId: number) => {
    try {
      setActionLoading(projectId);
      // Simulate restore API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setArchivedProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to restore project:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePermanentDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to permanently delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(projectId);
      // Simulate delete API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setArchivedProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredProjects = archivedProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToProjects}
            className="flex items-center text-dark-300 hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Projects
          </button>
          <div className="h-6 w-px bg-dark-600"></div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
              Archived Projects
            </h1>
            <p className="mt-1 text-dark-400">
              Manage and restore your archived projects
            </p>
          </div>
        </div>

        {archivedProjects.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search archived projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Archive}
          title={searchTerm ? "No matching archived projects" : "No archived projects"}
          description={searchTerm ? "Try adjusting your search terms." : "Archived projects will appear here when you archive them from the main projects view."}
          action={searchTerm ? {
            label: "Clear Search",
            onClick: () => setSearchTerm('')
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="card-gradient card-hover rounded-xl p-6 border border-dark-600">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Archive className="h-5 w-5 text-dark-400" />
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-dark-300">
                      Archived: {new Date(project.archived_at).toLocaleDateString()}
                    </div>
                    
                    {project.repo_url && (
                      <div className="text-xs text-dark-400 bg-dark-800 px-2 py-1 rounded">
                        {project.repo_url}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleRestore(project.id)}
                  disabled={actionLoading === project.id}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {actionLoading === project.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handlePermanentDelete(project.id)}
                  disabled={actionLoading === project.id}
                  className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveView;