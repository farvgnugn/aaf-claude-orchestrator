import React, { useState } from 'react';
import { X, GitBranch, Save, Key, Shield } from 'lucide-react';
import { Project, RepoBindingData } from '../../types';

interface RepoBindingFormProps {
  project: Project;
  onSubmit: (data: RepoBindingData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const RepoBindingForm: React.FC<RepoBindingFormProps> = ({
  project,
  onSubmit,
  onCancel,
  loading
}) => {
  const [formData, setFormData] = useState({
    repoProvider: project.repo_provider || 'github',
    repoUrl: project.repo_url || '',
    defaultBranch: project.repo_default_branch || 'main',
    workspaceRoot: project.workspace_root || '',
    githubWebhookSecret: project.github_webhook_secret || '',
    githubAppInstallationId: project.github_app_installation_id?.toString() || '',
    githubTokenEncrypted: project.github_token_encrypted || '',
    githubTokenExpiresAt: project.github_token_expires_at || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-blue-600" />
            Bind Repository - {project.name}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repository Provider
            </label>
            <select
              value={formData.repoProvider}
              onChange={(e) => handleChange('repoProvider', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="github">GitHub</option>
              <option value="gitlab">GitLab</option>
              <option value="bitbucket">Bitbucket</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repository URL
            </label>
            <input
              type="url"
              value={formData.repoUrl}
              onChange={(e) => handleChange('repoUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username/repo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Branch
            </label>
            <input
              type="text"
              value={formData.defaultBranch}
              onChange={(e) => handleChange('defaultBranch', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="main"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace Root
            </label>
            <input
              type="text"
              value={formData.workspaceRoot}
              onChange={(e) => handleChange('workspaceRoot', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/path/to/workspace"
              required
            />
          </div>

          {/* GitHub Integration Settings */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              GitHub Integration
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Secret
                </label>
                <input
                  type="password"
                  value={formData.githubWebhookSecret}
                  onChange={(e) => handleChange('githubWebhookSecret', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Webhook secret for GitHub events"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub App Installation ID
                </label>
                <input
                  type="text"
                  value={formData.githubAppInstallationId}
                  onChange={(e) => handleChange('githubAppInstallationId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Installation ID for GitHub App (recommended)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Preferred method for GitHub integration. Requires GitHub App setup.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Key className="h-4 w-4 mr-1" />
                  Personal Access Token (Legacy)
                </label>
                <input
                  type="password"
                  value={formData.githubTokenEncrypted}
                  onChange={(e) => handleChange('githubTokenEncrypted', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Fine-grained Personal Access Token"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Legacy method. Use GitHub App installation when possible.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Expiration Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.githubTokenExpiresAt}
                  onChange={(e) => handleChange('githubTokenExpiresAt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional: Set token expiration for automatic renewal alerts.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Binding...' : 'Bind Repository'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepoBindingForm;