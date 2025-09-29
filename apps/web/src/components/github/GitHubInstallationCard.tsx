import React from 'react';
import { Github, Users, User, Trash2, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import { GitHubInstallation } from '../../types';

interface GitHubInstallationCardProps {
  installation: GitHubInstallation;
  onDelete?: (installationId: number) => void;
  onSelect?: (installation: GitHubInstallation) => void;
  actionLoading?: number | null;
  isSelected?: boolean;
}

const GitHubInstallationCard: React.FC<GitHubInstallationCardProps> = ({
  installation,
  onDelete,
  onSelect,
  actionLoading,
  isSelected = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPermissionCount = () => {
    return Object.keys(installation.permissions || {}).length;
  };

  const getEventCount = () => {
    return (installation.events || []).length;
  };

  return (
    <div
      className={`card-gradient card-hover rounded-xl p-6 border transition-all duration-300 animate-fade-in-up ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
          : 'border-dark-600 hover:border-blue-500/50'
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={onSelect ? () => onSelect(installation) : undefined}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 bg-dark-800 border border-dark-600 rounded-lg">
              {installation.account_type === 'Organization' ? (
                <Users className="h-5 w-5 text-blue-400" />
              ) : (
                <User className="h-5 w-5 text-green-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center">
                {installation.account_login}
                {isSelected && <CheckCircle className="h-5 w-5 text-blue-400 ml-2" />}
              </h3>
              <div className="flex items-center space-x-2 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  installation.account_type === 'Organization'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'bg-green-600/20 text-green-400 border border-green-500/30'
                }`}>
                  {installation.account_type}
                </span>
                <span className="text-dark-300">
                  ID: {installation.installation_id.toString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm text-dark-300">
                <Github className="h-4 w-4 text-purple-400" />
                <span>{getPermissionCount()} permissions</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-dark-300">
                <ExternalLink className="h-4 w-4 text-orange-400" />
                <span>{getEventCount()} events</span>
              </div>
            </div>

            {installation.projects && installation.projects.length > 0 && (
              <div className="bg-dark-800 rounded-lg p-3 border border-dark-600">
                <div className="text-sm text-dark-300 mb-2">
                  Linked Projects ({installation.projects.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {installation.projects.slice(0, 3).map((project) => (
                    <span
                      key={project.id}
                      className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs border border-blue-500/30"
                    >
                      {project.name}
                    </span>
                  ))}
                  {installation.projects.length > 3 && (
                    <span className="px-2 py-1 bg-dark-700 text-dark-300 rounded text-xs border border-dark-500">
                      +{installation.projects.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 text-xs text-dark-400">
              <Calendar className="h-3 w-3" />
              <span>Created: {formatDate(installation.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {onDelete && (
          <div className="ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(installation.id);
              }}
              disabled={actionLoading === installation.id}
              className="p-2 text-dark-400 hover:text-red-400 bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-red-500/30 rounded-lg transition-all duration-300 hover:scale-105"
              title="Remove Installation"
            >
              {actionLoading === installation.id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubInstallationCard;