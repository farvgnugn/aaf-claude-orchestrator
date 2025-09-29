import React, { useState } from 'react';
import { X, Github, Save, ExternalLink, AlertCircle } from 'lucide-react';

interface GitHubInstallationFormData {
  installationId: string;
  accountLogin: string;
  accountType: 'User' | 'Organization';
}

interface GitHubInstallationFormProps {
  onSubmit: (data: GitHubInstallationFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const GitHubInstallationForm: React.FC<GitHubInstallationFormProps> = ({
  onSubmit,
  onCancel,
  loading
}) => {
  const [formData, setFormData] = useState<GitHubInstallationFormData>({
    installationId: '',
    accountLogin: '',
    accountType: 'User',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof GitHubInstallationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-900 border border-dark-600 rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Github className="h-5 w-5 mr-2 text-blue-400" />
            Add GitHub App Installation
          </h2>
          <button
            onClick={onCancel}
            className="text-dark-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Setup Required</p>
              <p className="text-blue-200/80">
                To add a GitHub App installation, you first need to install the GitHub App on your account or organization.
              </p>
              <a
                href="https://github.com/apps/your-app-name"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Install GitHub App
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Installation ID *
            </label>
            <input
              type="number"
              value={formData.installationId}
              onChange={(e) => handleChange('installationId', e.target.value)}
              className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="12345678"
              required
            />
            <p className="mt-1 text-xs text-dark-400">
              Find this in the installation URL after installing the GitHub App
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Account Name *
            </label>
            <input
              type="text"
              value={formData.accountLogin}
              onChange={(e) => handleChange('accountLogin', e.target.value)}
              className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="username or organization-name"
              required
            />
            <p className="mt-1 text-xs text-dark-400">
              The GitHub username or organization name where the app is installed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Account Type *
            </label>
            <select
              value={formData.accountType}
              onChange={(e) => handleChange('accountType', e.target.value as 'User' | 'Organization')}
              className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="User">User</option>
              <option value="Organization">Organization</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-dark-300 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Adding...' : 'Add Installation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GitHubInstallationForm;