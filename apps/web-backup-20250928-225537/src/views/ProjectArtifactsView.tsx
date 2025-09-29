import React, { useState } from 'react';
import { Plus, Archive } from 'lucide-react';
import { Artifact } from '../types';
import { apiService } from '../services/api';
import ArtifactCard from '../components/artifacts/ArtifactCard';
import ArtifactForm from '../components/artifacts/ArtifactForm';
import EmptyState from '../components/common/EmptyState';

interface ProjectArtifactsViewProps {
  projectId: number;
  artifacts: Artifact[];
  onArtifactsUpdate: () => void;
}

const ProjectArtifactsView: React.FC<ProjectArtifactsViewProps> = ({ 
  projectId, 
  artifacts, 
  onArtifactsUpdate 
}) => {
  const [showArtifactForm, setShowArtifactForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreateArtifact = async (data: any) => {
    try {
      setActionLoading(true);
      await apiService.createArtifact(data);
      onArtifactsUpdate();
      setShowArtifactForm(false);
    } catch (error) {
      console.error('Failed to create artifact:', error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Artifacts</h2>
          <p className="mt-1 text-gray-500">Manage versioned documents for this project</p>
        </div>
        <button
          onClick={() => setShowArtifactForm(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Artifact
        </button>
      </div>

      {artifacts.length === 0 ? (
        <EmptyState
          icon={Archive}
          title="No artifacts yet"
          description="Create your first artifact to start managing project documentation."
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
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default ProjectArtifactsView;