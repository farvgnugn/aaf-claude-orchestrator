import React, { useState, useEffect } from 'react';
import { Plus, Github, RefreshCw, Search } from 'lucide-react';
import { GitHubInstallation } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import GitHubInstallationCard from './GitHubInstallationCard';
import GitHubInstallationForm from './GitHubInstallationForm';

interface GitHubInstallationsManagerProps {
  onSelectInstallation?: (installation: GitHubInstallation) => void;
  selectedInstallationId?: number;
  showSelectionMode?: boolean;
}

const GitHubInstallationsManager: React.FC<GitHubInstallationsManagerProps> = ({
  onSelectInstallation,
  selectedInstallationId,
  showSelectionMode = false
}) => {
  const [installations, setInstallations] = useState<GitHubInstallation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchInstallations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/github-installations');
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub installations');
      }
      const data = await response.json();
      setInstallations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  const handleAddInstallation = async (formData: any) => {
    try {
      setActionLoading(0); // Use 0 for form loading
      const response = await fetch('/api/github-installations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          installation_id: parseInt(formData.installationId),
          account_login: formData.accountLogin,
          account_type: formData.accountType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add GitHub installation');
      }

      await fetchInstallations();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add installation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteInstallation = async (installationId: number) => {
    if (!confirm('Are you sure you want to remove this GitHub installation? This will affect all linked projects.')) {
      return;
    }

    try {
      setActionLoading(installationId);
      const response = await fetch(`/api/github-installations/${installationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete GitHub installation');
      }

      await fetchInstallations();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete installation');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredInstallations = installations.filter(installation =>
    installation.account_login.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Github className="h-6 w-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">
            GitHub App Installations
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchInstallations}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-dark-300 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-md transition-colors flex items-center disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {!showSelectionMode && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Installation
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      {installations.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search installations..."
            className="w-full pl-10 pr-3 py-2 bg-dark-800 border border-dark-600 rounded-md text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Selection Mode Info */}
      {showSelectionMode && (
        <div className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">
            Select a GitHub App installation to link with your project. This enables automated GitHub integration.
          </p>
        </div>
      )}

      {/* Installations List */}
      {filteredInstallations.length === 0 ? (
        <EmptyState
          icon={Github}
          title="No GitHub App Installations"
          description={
            installations.length === 0
              ? "Add your first GitHub App installation to enable automated GitHub integration for your projects."
              : "No installations match your search criteria."
          }
          action={
            !showSelectionMode && installations.length === 0 ? (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Installation
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-6">
          {filteredInstallations.map((installation) => (
            <GitHubInstallationCard
              key={installation.id}
              installation={installation}
              onDelete={!showSelectionMode ? handleDeleteInstallation : undefined}
              onSelect={onSelectInstallation}
              actionLoading={actionLoading}
              isSelected={selectedInstallationId === installation.id}
            />
          ))}
        </div>
      )}

      {/* Add Installation Form */}
      {showForm && (
        <GitHubInstallationForm
          onSubmit={handleAddInstallation}
          onCancel={() => setShowForm(false)}
          loading={actionLoading === 0}
        />
      )}
    </div>
  );
};

export default GitHubInstallationsManager;