import React from 'react';
import { CheckCircle, XCircle, GitBranch, Folder, ExternalLink, Archive, Play, Link } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onArchive?: (projectId: number) => void;
  onBindRepo?: (project: Project) => void;
  onBootstrap?: (project: Project) => void;
  actionLoading?: number | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onClick, 
  onArchive, 
  onBindRepo, 
  onBootstrap, 
  actionLoading 
}) => {
  return (
    <div 
      className="card-gradient card-hover rounded-xl p-6 border border-dark-600 cursor-pointer group animate-fade-in-up"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1" onClick={onClick}>
          <div className="flex items-center space-x-2 mb-2">
            <Folder className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
              {project.name}
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              {project.repo_ready ? (
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${project.repo_ready ? 'text-emerald-400' : 'text-red-400'}`}>
                Repo {project.repo_ready ? 'Ready' : 'Not Ready'}
              </span>
            </div>

            {project.repo_url && (
              <div className="flex items-center space-x-2 text-dark-300">
                <GitBranch className="h-4 w-4 text-blue-400" />
                <span className="text-sm truncate">{project.repo_url}</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </div>
            )}

            <div className="text-xs text-dark-400">
              Branch: <span className="font-mono text-blue-300">{project.repo_default_branch}</span>
            </div>
            {project.workspace_root && (
              <div className="text-xs text-dark-300 bg-dark-800 px-2 py-1 rounded border border-dark-600">
                {project.workspace_root}
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 ml-4">
          {onBindRepo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBindRepo(project);
              }}
              className="p-2 text-blue-400 hover:text-blue-300 bg-dark-800 hover:bg-dark-700 border border-blue-500/30 hover:border-blue-400 rounded-lg transition-all duration-300 hover:scale-105"
              title="Bind Repository"
            >
              <Link className="h-4 w-4" />
            </button>
          )}
          
          {onBootstrap && project.repo_url && !project.repo_ready && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBootstrap(project);
              }}
              disabled={actionLoading === project.id}
              className="p-2 text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 rounded-lg transition-all duration-300 disabled:opacity-50 hover:scale-105"
              title="Bootstrap Repository"
            >
              {actionLoading === project.id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          )}
          
          {onArchive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive(project.id);
              }}
              className="p-2 text-dark-400 hover:text-red-400 bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-red-500/30 rounded-lg transition-all duration-300 hover:scale-105"
              title="Archive Project"
            >
              <Archive className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;