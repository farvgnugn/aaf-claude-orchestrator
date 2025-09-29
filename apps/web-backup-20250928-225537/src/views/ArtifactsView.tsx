import React, { useState, useEffect } from 'react';
import { Plus, Archive } from 'lucide-react';
import { Artifact } from '../types';
import { apiService } from '../services/api';
import ArtifactCard from '../components/artifacts/ArtifactCard';
import ArtifactForm from '../components/artifacts/ArtifactForm';
import EmptyState from '../components/common/EmptyState';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ArtifactsView: React.FC = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArtifactForm, setShowArtifactForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadArtifacts();
  }, []);

  const loadArtifacts = async () => {
    try {
      const data = await apiService.getArtifacts();
      setArtifacts(data);
    } catch (error) {
      console.error('Failed to load artifacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArtifact = async (data: any) => {
    try {
      setActionLoading(true);
      await apiService.createArtifact(data);
      await loadArtifacts(); // Reload artifacts list
      setShowArtifactForm(false);
    } catch (error) {
      console.error('Failed to create artifact:', error);
    } finally {
      setActionLoading(false);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artifacts</h1>
          <p className="mt-1 text-gray-500">
            Manage versioned documents and artifacts across projects
          </p>
        </div>
        <button
          onClick={() => setShowArtifactForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Artifact
        </button>
      </div>

      {artifacts.length === 0 ? (
        <EmptyState
          icon={Archive}
          title="No artifacts yet"
          description="Create your first artifact to start managing project documentation and specifications."
          action={{
            label: "Create Artifact",
            onClick: () => setShowArtifactForm(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artifacts.map(artifact => (
            <ArtifactCard
              key={artifact.id}
              artifact={artifact}
              onClick={() => {/* TODO: Navigate to artifact detail */}}
            />
          ))}
        </div>
      )}

      {showArtifactForm && (
        <ArtifactForm
          onSubmit={handleCreateArtifact}
          onCancel={() => setShowArtifactForm(false)}
          loading={actionLoading}
          projectId={1} // TODO: Get from context or selection
        />
      )}
    </div>
  );
};

export default ArtifactsView;