import React, { useState } from 'react';
import { X, Save, GitBranch, Github } from 'lucide-react';
import { Project } from '../../types';

interface ProjectFormProps {
  onSubmit: (name: string, setupGitHub?: boolean) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onSubmit, onCancel, loading }) => {
  const [name, setName] = useState('');
  const [setupGitHub, setSetupGitHub] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), setupGitHub);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-dark-900 border border-dark-600 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-blue-400" />
            Create New Project
          </h2>
          <button
            onClick={onCancel}
            className="text-dark-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-300 mb-2">
              Project Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project name..."
              autoFocus
            />
          </div>

          <div className="border-t border-dark-600 pt-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="setupGitHub"
                checked={setupGitHub}
                onChange={(e) => setSetupGitHub(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 bg-dark-800 border-dark-600 rounded focus:ring-blue-500"
              />
              <div>
                <label htmlFor="setupGitHub" className="text-sm font-medium text-dark-300 flex items-center">
                  <Github className="h-4 w-4 mr-2 text-blue-400" />
                  Set up GitHub integration
                </label>
                <p className="text-xs text-dark-400 mt-1">
                  Automatically open repository binding form after project creation
                </p>
              </div>
            </div>
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
              disabled={!name.trim() || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;