import React, { useState, useEffect } from 'react';
import { Plus, GitBranch, Play } from 'lucide-react';
import { Project } from '../types';
import { Epic } from '../types';
import { apiService } from '../services/api';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import RepoBindingForm from '../components/projects/RepoBindingForm';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ProjectsViewProps {
  onSelectProject: (projectId: number) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ onSelectProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showRepoForm, setShowRepoForm] = useState<Project | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [archiveLoading, setArchiveLoading] = useState<number | null>(null);

  useEffect(() => {
    loadProjects();
    loadEpics();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEpics = async () => {
    try {
      const data = await apiService.getEpics();
      setEpics(data);
    } catch (error) {
      console.error('Failed to load epics:', error);
    }
  };

  const getProjectEpicCount = (projectId: number) => {
    return epics.filter(epic => epic.project_id === projectId).length;
  };
  const handleCreateProject = async (name: string) => {
    try {
      setActionLoading(0);
      const newProject = await apiService.createProject(name);
      setProjects([...projects, newProject]);
      setShowProjectForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBindRepository = async (data: any) => {
    if (!showRepoForm) return;
    
    try {
      setActionLoading(showRepoForm.id);
      await apiService.bindRepository(showRepoForm.id, data);
      await loadProjects(); // Refresh to get updated data
      setShowRepoForm(null);
    } catch (error) {
      console.error('Failed to bind repository:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBootstrap = async (project: Project) => {
    try {
      setActionLoading(project.id);
      await apiService.bootstrapRepo(project.id);
      await loadProjects(); // Refresh to get updated status
    } catch (error) {
      console.error('Failed to bootstrap repository:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchiveProject = async (projectId: number) => {
    if (!confirm('Are you sure you want to archive this project? You can restore it later from the archive.')) {
      return;
    }

    try {
      setArchiveLoading(projectId);
      // Simulate archive API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Remove from current projects list
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to archive project:', error);
    } finally {
      setArchiveLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="mt-1 text-dark-400">
            Manage your development projects and repository bindings
          </p>
        </div>
        <button
          onClick={() => setShowProjectForm(true)}
          className="btn-primary inline-flex items-center px-6 py-3 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={GitBranch}
          title="No projects yet"
          description="Create your first project to start managing epics, stories, and artifacts."
          action={{
            label: "Create Project",
            onClick: () => setShowProjectForm(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} style={{ opacity: archiveLoading === project.id ? 0.5 : 1 }}>
              <ProjectCard
                project={project}
                onClick={() => onSelectProject(project.id)}
                onArchive={handleArchiveProject}
                onBindRepo={setShowRepoForm}
                onBootstrap={handleBootstrap}
                actionLoading={actionLoading}
              />
              
              <div className="text-sm text-dark-400 px-4 mt-2">
                {getProjectEpicCount(project.id)} epics
              </div>
            </div>
          ))}
        </div>
      )}

      {showProjectForm && (
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowProjectForm(false)}
          loading={actionLoading === 0}
        />
      )}

      {showRepoForm && (
        <RepoBindingForm
          project={showRepoForm}
          onSubmit={handleBindRepository}
          onCancel={() => setShowRepoForm(null)}
          loading={actionLoading === showRepoForm.id}
        />
      )}
    </div>
  );
};

export default ProjectsView;